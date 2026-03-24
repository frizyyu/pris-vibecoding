export type TaskStatus = "PLANNED" | "IN_PROGRESS" | "DONE";
export type EffectiveTaskStatus = TaskStatus | "OVERDUE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskFilter = "ALL" | "ACTIVE" | "DONE" | "OVERDUE";
export type TaskSortField = "createdAt" | "dueDate" | "priority";
export type TaskSortDirection = "asc" | "desc";

export class TaskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskValidationError";
  }
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCreateInput {
  title: string;
  description?: string | null;
  dueDate: Date | string;
  priority?: TaskPriority;
  status?: TaskStatus;
  completedAt?: Date | string | null;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  dueDate?: Date | string;
  priority?: TaskPriority;
  status?: TaskStatus;
  completedAt?: Date | string | null;
}

export interface TaskListOptions {
  query?: string;
  filter?: TaskFilter;
  status?: TaskStatus | "ALL";
  priority?: TaskPriority | "ALL";
  onlyOverdue?: boolean;
  sortBy?: TaskSortField;
  sortDirection?: TaskSortDirection;
  now?: Date;
}

export interface TaskRepository {
  findMany(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(data: TaskCreateInput): Promise<Task>;
  update(id: string, data: TaskUpdateInput): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}

export interface TaskService {
  list(options?: TaskListOptions): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(data: TaskCreateInput): Promise<Task>;
  update(id: string, data: TaskUpdateInput): Promise<Task | null>;
  toggleStatus(id: string): Promise<Task | null>;
  markDone(id: string): Promise<Task | null>;
  reopen(id: string): Promise<Task | null>;
  remove(id: string): Promise<boolean>;
}

export function normalizeTaskTitle(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeTaskDescription(value: string | null | undefined): string | null {
  if (value == null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeTaskDate(value: Date | string | null | undefined): Date | null {
  if (value == null || value === "") {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function validateTaskTitle(value: string): string {
  const title = normalizeTaskTitle(value);

  if (!title) {
    throw new TaskValidationError("Title is required.");
  }

  if (title.length > 120) {
    throw new TaskValidationError("Title must be 120 characters or fewer.");
  }

  return title;
}

export function validateTaskDeadline(value: Date | string | null | undefined): Date {
  const dueDate = normalizeTaskDate(value);

  if (!dueDate) {
    throw new TaskValidationError("Deadline is required.");
  }

  return dueDate;
}

export function normalizeTaskCompletedAt(status?: TaskStatus, value?: Date | string | null): Date | null {
  if (status === "DONE") {
    return normalizeTaskDate(value) ?? new Date();
  }

  if (status === "PLANNED" || status === "IN_PROGRESS") {
    return null;
  }

  return normalizeTaskDate(value);
}

export function isTaskOverdue(task: Pick<Task, "status" | "dueDate">, now: Date = new Date()): boolean {
  return task.status !== "DONE" && task.dueDate.getTime() < now.getTime();
}

export function getEffectiveTaskStatus(task: Pick<Task, "status" | "dueDate">, now: Date = new Date()): EffectiveTaskStatus {
  if (isTaskOverdue(task, now)) {
    return "OVERDUE";
  }

  return task.status;
}

export function filterTasks(tasks: Task[], options: TaskListOptions = {}): Task[] {
  const now = options.now ?? new Date();
  const query = options.query?.trim().toLowerCase();
  const filter = options.filter ?? "ALL";

  return tasks.filter((task) => {
    const effectiveStatus = getEffectiveTaskStatus(task, now);

    if (filter === "ACTIVE" && !(effectiveStatus === "PLANNED" || effectiveStatus === "IN_PROGRESS")) {
      return false;
    }

    if (filter === "DONE" && effectiveStatus !== "DONE") {
      return false;
    }

    if (filter === "OVERDUE" && effectiveStatus !== "OVERDUE") {
      return false;
    }

    if (options.status && options.status !== "ALL" && task.status !== options.status) {
      return false;
    }

    if (options.priority && options.priority !== "ALL" && task.priority !== options.priority) {
      return false;
    }

    if (options.onlyOverdue && effectiveStatus !== "OVERDUE") {
      return false;
    }

    if (query) {
      const haystack = [task.title, task.description ?? ""].join(" ").toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function sortTasks(
  tasks: Task[],
  options: Pick<TaskListOptions, "sortBy" | "sortDirection"> = {},
): Task[] {
  const sortBy = options.sortBy ?? "dueDate";
  const direction = options.sortDirection ?? (sortBy === "priority" ? "desc" : "asc");
  const factor = direction === "asc" ? 1 : -1;

  return [...tasks].sort((left, right) => factor * compareTasks(left, right, sortBy));
}

export function listTasks(tasks: Task[], options: TaskListOptions = {}): Task[] {
  return sortTasks(filterTasks(tasks, options), options);
}

export function createTaskService(repository: TaskRepository): TaskService {
  return {
    async list(options) {
      return listTasks(await repository.findMany(), options);
    },
    getById(id) {
      return repository.findById(id);
    },
    create(data) {
      return repository.create(normalizeTaskCreateInput(data));
    },
    update(id, data) {
      return repository.update(id, normalizeTaskUpdateInput(data));
    },
    async toggleStatus(id) {
      const task = await repository.findById(id);
      if (!task) {
        return null;
      }

      if (task.status === "DONE") {
        return repository.update(id, { status: "IN_PROGRESS", completedAt: null });
      }

      return repository.update(id, { status: "DONE", completedAt: new Date() });
    },
    markDone(id) {
      return repository.update(id, { status: "DONE", completedAt: new Date() });
    },
    reopen(id) {
      return repository.update(id, { status: "IN_PROGRESS", completedAt: null });
    },
    remove(id) {
      return repository.delete(id);
    },
  };
}

function normalizeTaskCreateInput(data: TaskCreateInput): TaskCreateInput {
  const status = data.status ?? "PLANNED";

  return {
    ...data,
    title: validateTaskTitle(data.title),
    description: normalizeTaskDescription(data.description),
    dueDate: validateTaskDeadline(data.dueDate),
    completedAt: normalizeTaskCompletedAt(status, data.completedAt),
    priority: data.priority ?? "MEDIUM",
    status,
  };
}

function normalizeTaskUpdateInput(data: TaskUpdateInput): TaskUpdateInput {
  const normalized: TaskUpdateInput = { ...data };

  if ("title" in normalized && typeof normalized.title === "string") {
    normalized.title = validateTaskTitle(normalized.title);
  }

  if ("description" in normalized) {
    normalized.description = normalizeTaskDescription(normalized.description);
  }

  if ("dueDate" in normalized) {
    normalized.dueDate = validateTaskDeadline(normalized.dueDate);
  }

  if ("completedAt" in normalized || normalized.status) {
    normalized.completedAt = normalizeTaskCompletedAt(normalized.status, normalized.completedAt);
  }

  return normalized;
}

function compareTasks(left: Task, right: Task, sortBy: TaskSortField): number {
  switch (sortBy) {
    case "createdAt":
      return left.createdAt.getTime() - right.createdAt.getTime();
    case "priority":
      return comparePriority(left.priority, right.priority);
    case "dueDate":
    default:
      return left.dueDate.getTime() - right.dueDate.getTime();
  }
}

function comparePriority(left: TaskPriority, right: TaskPriority): number {
  return priorityWeight(left) - priorityWeight(right);
}

function priorityWeight(priority: TaskPriority): number {
  switch (priority) {
    case "HIGH":
      return 3;
    case "MEDIUM":
      return 2;
    case "LOW":
    default:
      return 1;
  }
}

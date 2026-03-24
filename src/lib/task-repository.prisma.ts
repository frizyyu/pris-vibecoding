import { Prisma, type Task as PrismaTask } from "@/src/generated/prisma";
import { prisma } from "@/src/lib/prisma";
import {
  TaskValidationError,
  normalizeTaskCompletedAt,
  normalizeTaskDate,
  normalizeTaskDescription,
  normalizeTaskTitle,
  type Task,
  type TaskCreateInput,
  type TaskPriority,
  type TaskRepository,
  type TaskStatus,
  type TaskUpdateInput,
} from "@/src/lib/tasks";

export function createPrismaTaskRepository(): TaskRepository {
  return {
    async findMany() {
      const tasks = await prisma.task.findMany({
        orderBy: {
          dueDate: "asc",
        },
      });

      return tasks.map(mapTask);
    },
    async findById(id) {
      const task = await prisma.task.findUnique({ where: { id } });
      return task ? mapTask(task) : null;
    },
    async create(data) {
      const task = await prisma.task.create({
        data: prepareCreateData(data),
      });

      return mapTask(task);
    },
    async update(id, data) {
      try {
        const task = await prisma.task.update({
          where: { id },
          data: prepareUpdateData(data),
        });

        return mapTask(task);
      } catch (error) {
        if (isRecordNotFoundError(error)) {
          return null;
        }

        throw error;
      }
    },
    async delete(id) {
      try {
        await prisma.task.delete({ where: { id } });
        return true;
      } catch (error) {
        if (isRecordNotFoundError(error)) {
          return false;
        }

        throw error;
      }
    },
  };
}

function prepareCreateData(data: TaskCreateInput): Prisma.TaskCreateInput {
  return {
    title: normalizeTaskTitle(data.title),
    description: normalizeTaskDescription(data.description),
    status: data.status ?? "PLANNED",
    priority: data.priority ?? "MEDIUM",
    dueDate: normalizePrismaDate(data.dueDate),
    completedAt: normalizeTaskCompletedAt(data.status, data.completedAt),
  };
}

function prepareUpdateData(data: TaskUpdateInput): Prisma.TaskUpdateInput {
  const payload: Prisma.TaskUpdateInput = {};

  if (typeof data.title === "string") {
    payload.title = normalizeTaskTitle(data.title);
  }

  if ("description" in data) {
    payload.description = normalizeTaskDescription(data.description);
  }

  if (data.status) {
    payload.status = data.status;
  }

  if (data.priority) {
    payload.priority = data.priority;
  }

  if ("dueDate" in data) {
    payload.dueDate = normalizePrismaDate(data.dueDate);
  }

  if ("completedAt" in data || data.status) {
    payload.completedAt = normalizeTaskCompletedAt(data.status, data.completedAt);
  }

  return payload;
}

function mapTask(task: PrismaTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority,
    dueDate: task.dueDate,
    completedAt: task.completedAt,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

function normalizePrismaDate(value: Date | string | null | undefined): Date {
  const date = normalizeTaskDate(value);

  if (!date) {
    throw new TaskValidationError("Deadline is required.");
  }

  return date;
}

function isRecordNotFoundError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2025";
}

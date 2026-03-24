import type { EffectiveTaskStatus, TaskFilter, TaskPriority, TaskSortDirection, TaskSortField, TaskStatus } from "@/src/lib/tasks";

export const TASK_FILTERS: TaskFilter[] = ["ALL", "ACTIVE", "DONE", "OVERDUE"];
export const TASK_STATUSES: TaskStatus[] = ["PLANNED", "IN_PROGRESS", "DONE"];
export const TASK_STATUSES_WITH_ALL: Array<TaskStatus | "ALL"> = ["ALL", ...TASK_STATUSES];
export const TASK_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
export const TASK_PRIORITIES_WITH_ALL: Array<TaskPriority | "ALL"> = ["ALL", ...TASK_PRIORITIES];
export const TASK_SORT_FIELDS: TaskSortField[] = ["dueDate", "priority", "createdAt"];
export const TASK_SORT_DIRECTIONS: TaskSortDirection[] = ["asc", "desc"];

export const TASK_FILTER_LABELS: Record<TaskFilter, string> = {
  ALL: "Все задачи",
  ACTIVE: "Активные",
  DONE: "Выполненные",
  OVERDUE: "Просроченные",
};

export const TASK_STATUS_LABELS: Record<EffectiveTaskStatus, string> = {
  PLANNED: "Запланирована",
  IN_PROGRESS: "В работе",
  DONE: "Выполнена",
  OVERDUE: "Просрочена",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
};

export const TASK_SORT_FIELD_LABELS: Record<TaskSortField, string> = {
  dueDate: "По дедлайну",
  priority: "По приоритету",
  createdAt: "По дате создания",
};

export const TASK_SORT_DIRECTION_LABELS: Record<TaskSortDirection, string> = {
  asc: "По возрастанию",
  desc: "По убыванию",
};

export const TASK_STATUS_TONES: Record<EffectiveTaskStatus, string> = {
  PLANNED: "bg-slate-100 text-slate-800",
  IN_PROGRESS: "bg-sky-100 text-sky-800",
  DONE: "bg-emerald-100 text-emerald-800",
  OVERDUE: "bg-red-100 text-red-800",
};

export const TASK_PRIORITY_TONES: Record<TaskPriority, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH: "bg-fuchsia-100 text-fuchsia-800",
};

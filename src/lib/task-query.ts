import type {
  TaskCreateInput,
  TaskFilter,
  TaskListOptions,
  TaskPriority,
  TaskSortDirection,
  TaskSortField,
  TaskStatus,
} from "@/src/lib/tasks";
import {
  TASK_FILTERS,
  TASK_PRIORITIES_WITH_ALL,
  TASK_SORT_FIELDS,
  TASK_STATUSES_WITH_ALL,
} from "@/src/lib/task-metadata";

type SearchValue = string | string[] | undefined;
type SearchParamsLike = Record<string, SearchValue>;

export function listOptionsFromSearchParams(searchParams: SearchParamsLike): TaskListOptions {
  return {
    query: readValue(searchParams.query),
    filter: parseFilter(readValue(searchParams.filter)),
    status: parseStatus(readValue(searchParams.status)),
    priority: parsePriority(readValue(searchParams.priority)),
    onlyOverdue: parseBoolean(readValue(searchParams.onlyOverdue)),
    sortBy: parseSortField(readValue(searchParams.sortBy)),
    sortDirection: parseSortDirection(readValue(searchParams.sortDirection)),
  };
}

export function listOptionsFromUrlSearchParams(searchParams: URLSearchParams): TaskListOptions {
  return listOptionsFromSearchParams(Object.fromEntries(searchParams.entries()));
}

export function readTaskInputFromFormData(formData: FormData): TaskCreateInput {
  return {
    title: stringOrEmpty(formData.get("title")),
    description: nullableString(formData.get("description")),
    status: parseTaskStatus(nullableString(formData.get("status"))) ?? "PLANNED",
    priority: parseTaskPriority(nullableString(formData.get("priority"))) ?? "MEDIUM",
    dueDate: stringOrEmpty(formData.get("dueDate")),
  };
}

export function toDatetimeLocalValue(date: Date | null): string {
  if (!date) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function readValue(value: SearchValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value ?? undefined;
}

function nullableString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function stringOrEmpty(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (!value) {
    return undefined;
  }

  return value === "true" || value === "1" || value === "on";
}

function parseFilter(value: string | undefined): TaskFilter | undefined {
  return TASK_FILTERS.find((filter) => filter === value);
}

function parseStatus(value: string | undefined): TaskStatus | "ALL" | undefined {
  return TASK_STATUSES_WITH_ALL.find((status) => status === value);
}

function parsePriority(value: string | undefined): TaskPriority | "ALL" | undefined {
  return TASK_PRIORITIES_WITH_ALL.find((priority) => priority === value);
}

function parseSortField(value: string | undefined): TaskSortField | undefined {
  return TASK_SORT_FIELDS.find((field) => field === value);
}

function parseSortDirection(value: string | undefined): TaskSortDirection | undefined {
  if (value === "asc" || value === "desc") {
    return value;
  }

  return undefined;
}

function parseTaskStatus(value: string | null): TaskStatus | undefined {
  return value === "PLANNED" || value === "IN_PROGRESS" || value === "DONE" ? value : undefined;
}

function parseTaskPriority(value: string | null): TaskPriority | undefined {
  return value === "LOW" || value === "MEDIUM" || value === "HIGH" ? value : undefined;
}

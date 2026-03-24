import { getEffectiveTaskStatus, type Task } from "@/src/lib/tasks";

export function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function pluralizeTasks(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return "задача";
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "задачи";
  }

  return "задач";
}

export function buildTaskStats(tasks: Task[]) {
  return tasks.reduce(
    (acc, task) => {
      const effectiveStatus = getEffectiveTaskStatus(task);

      acc.total += 1;

      if (effectiveStatus === "DONE") {
        acc.done += 1;
      }

      if (effectiveStatus === "IN_PROGRESS") {
        acc.inProgress += 1;
      }

      if (effectiveStatus === "OVERDUE") {
        acc.overdue += 1;
      }

      return acc;
    },
    { total: 0, done: 0, inProgress: 0, overdue: 0 },
  );
}

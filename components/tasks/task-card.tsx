import Link from "next/link";
import { isTaskOverdue, type Task } from "@/src/lib/tasks";
import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_TONES,
  TASK_STATUS_LABELS,
  TASK_STATUS_TONES,
} from "@/src/lib/task-metadata";
import { formatDateTime } from "@/src/lib/task-presentation";

type TaskCardProps = {
  task: Task;
  deleteAction: string;
  toggleAction: string;
  showDetails?: boolean;
};

export function TaskCard({ task, deleteAction, toggleAction, showDetails = false }: TaskCardProps) {
  const overdue = isTaskOverdue(task);
  const effectiveStatus = overdue ? "OVERDUE" : task.status;

  return (
    <article className={`flex h-full flex-col rounded-[1.75rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[var(--shadow)] ${overdue ? "border-red-300 bg-red-50/80" : "border-slate-700/10 bg-white/80"}`}>
      <div className="flex flex-wrap gap-2">
        <Pill className={TASK_STATUS_TONES[effectiveStatus]}>{TASK_STATUS_LABELS[effectiveStatus]}</Pill>
        <Pill className={TASK_PRIORITY_TONES[task.priority]}>{TASK_PRIORITY_LABELS[task.priority]}</Pill>
      </div>

      <div className="mt-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight">{task.title}</h3>
          <p className="text-sm leading-6 text-slate-600">{task.description || "Описание не указано."}</p>
        </div>

        <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-800">Дедлайн</dt>
            <dd>{formatDateTime(task.dueDate)}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-800">Обновлена</dt>
            <dd>{formatDateTime(task.updatedAt)}</dd>
          </div>
          {showDetails ? (
            <>
              <div>
                <dt className="font-medium text-slate-800">Создана</dt>
                <dd>{formatDateTime(task.createdAt)}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Завершена</dt>
                <dd>{task.completedAt ? formatDateTime(task.completedAt) : "Пока нет"}</dd>
              </div>
            </>
          ) : null}
        </dl>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <form action={toggleAction} method="post">
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
              task.status === "DONE"
                ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {task.status === "DONE" ? "Вернуть в работу" : "Отметить выполненной"}
          </button>
        </form>

        <Link
          href={`/tasks/${task.id}`}
          className="rounded-full border border-slate-800/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
        >
          Редактировать
        </Link>

        <form action={deleteAction} method="post">
          <button className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100">
            Удалить
          </button>
        </form>
      </div>

      {overdue ? (
        <p className="mt-4 rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm font-medium text-[var(--danger)]">
          Срок выполнения истёк. Задача автоматически считается просроченной.
        </p>
      ) : null}
    </article>
  );
}

function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

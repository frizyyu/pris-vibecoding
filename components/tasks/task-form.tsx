import Link from "next/link";
import type { Task } from "@/src/lib/tasks";
import { toDatetimeLocalValue } from "@/src/lib/task-query";
import { TASK_PRIORITIES, TASK_PRIORITY_LABELS, TASK_STATUSES, TASK_STATUS_LABELS } from "@/src/lib/task-metadata";

type TaskFormProps = {
  action: string;
  mode: "create" | "edit";
  task?: Task;
  errorMessage?: string;
};

export function TaskForm({ action, mode, task, errorMessage }: TaskFormProps) {
  const isEdit = mode === "edit";

  return (
    <section className="rounded-[2rem] border border-slate-700/10 bg-[var(--paper)] p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold">{isEdit ? "Редактирование задачи" : "Создание задачи"}</h2>
        <p className="text-sm leading-6 text-slate-600">
          {isEdit
            ? "Обновите статус, приоритет и срок выполнения задачи."
            : "Добавьте задачу с обязательным дедлайном, чтобы контролировать сроки выполнения."}
        </p>
      </div>

      {errorMessage ? (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <form action={action} method="post" className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Название</span>
          <input
            required
            maxLength={120}
            name="title"
            placeholder="Например, подготовить презентацию к защите"
            defaultValue={task?.title ?? ""}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Описание</span>
          <textarea
            name="description"
            placeholder="Кратко опишите содержание задачи"
            defaultValue={task?.description ?? ""}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Статус</span>
            <select name="status" defaultValue={task?.status ?? "PLANNED"}>
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {TASK_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Приоритет</span>
            <select name="priority" defaultValue={task?.priority ?? "MEDIUM"}>
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {TASK_PRIORITY_LABELS[priority]}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Дедлайн</span>
            <input
              required
              name="dueDate"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(task?.dueDate ?? null)}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
            {isEdit ? "Сохранить изменения" : "Создать задачу"}
          </button>
          <Link
            href={isEdit && task ? `/tasks/${task.id}` : "/"}
            className="rounded-full border border-slate-800/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Отмена
          </Link>
        </div>
      </form>
    </section>
  );
}

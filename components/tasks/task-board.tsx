import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { TaskCard } from "@/components/tasks/task-card";
import type { Task, TaskListOptions, TaskSortDirection } from "@/src/lib/tasks";
import {
  TASK_FILTER_LABELS,
  TASK_FILTERS,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITIES_WITH_ALL,
  TASK_SORT_DIRECTION_LABELS,
  TASK_SORT_DIRECTIONS,
  TASK_SORT_FIELD_LABELS,
  TASK_SORT_FIELDS,
  TASK_STATUS_LABELS,
  TASK_STATUSES_WITH_ALL,
} from "@/src/lib/task-metadata";
import { buildTaskStats, pluralizeTasks } from "@/src/lib/task-presentation";

type TaskBoardProps = {
  tasks: Task[];
  filters: TaskListOptions;
};

export function TaskBoard({ tasks, filters }: TaskBoardProps) {
  const stats = buildTaskStats(tasks);

  return (
    <SiteShell
      eyebrow="Лабораторная работа"
      title="Прототип управления задачами и сроками"
      description="MVP для создания, редактирования и анализа задач с дедлайнами, приоритетами, поиском, фильтрацией и сортировкой."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-slate-700/10 bg-[var(--paper)] p-6 shadow-[var(--shadow)] backdrop-blur">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Панель управления</h2>
                <p className="mt-1 text-sm text-slate-600">Поиск, фильтры и сортировка работают совместно.</p>
              </div>
              <Link
                href="/tasks/new"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Новая задача
              </Link>
            </div>

            <form className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Поиск по названию и описанию</span>
                <input name="query" placeholder="Например, защита, README или дедлайн" defaultValue={filters.query ?? ""} />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <FilterSelect
                  name="filter"
                  label="Быстрый фильтр"
                  value={filters.filter ?? "ALL"}
                  options={TASK_FILTERS.map((filter) => ({ value: filter, label: TASK_FILTER_LABELS[filter] }))}
                />

                <FilterSelect
                  name="status"
                  label="Статус"
                  value={filters.status ?? "ALL"}
                  options={TASK_STATUSES_WITH_ALL.map((status) => ({
                    value: status,
                    label: status === "ALL" ? "Все статусы" : TASK_STATUS_LABELS[status],
                  }))}
                />

                <FilterSelect
                  name="priority"
                  label="Приоритет"
                  value={filters.priority ?? "ALL"}
                  options={TASK_PRIORITIES_WITH_ALL.map((priority) => ({
                    value: priority,
                    label: priority === "ALL" ? "Все приоритеты" : TASK_PRIORITY_LABELS[priority],
                  }))}
                />

                <FilterSelect
                  name="onlyOverdue"
                  label="Просроченность"
                  value={filters.onlyOverdue ? "true" : "false"}
                  options={[
                    { value: "false", label: "Не учитывать" },
                    { value: "true", label: "Только просроченные" },
                  ]}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FilterSelect
                  name="sortBy"
                  label="Сортировка"
                  value={filters.sortBy ?? "dueDate"}
                  options={TASK_SORT_FIELDS.map((field) => ({ value: field, label: TASK_SORT_FIELD_LABELS[field] }))}
                />

                <FilterSelect
                  name="sortDirection"
                  label="Порядок"
                  value={filters.sortDirection ?? defaultSortDirection(filters.sortBy)}
                  options={TASK_SORT_DIRECTIONS.map((direction) => ({
                    value: direction,
                    label: TASK_SORT_DIRECTION_LABELS[direction],
                  }))}
                />
              </div>

              <div className="rounded-2xl border border-slate-700/10 bg-white/70 px-4 py-3 text-sm text-slate-600">
                Текущий набор можно комбинировать: сначала поиск, затем фильтры по статусу, приоритету и просроченности, после чего применяется сортировка.
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-500">
                  Применить
                </button>
                <Link
                  href="/"
                  className="rounded-full border border-slate-800/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  Сбросить
                </Link>
              </div>
            </form>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <StatCard label="Всего задач" value={stats.total} tone="slate" />
            <StatCard label="В работе" value={stats.inProgress} tone="sky" />
            <StatCard label="Просрочено" value={stats.overdue} tone="red" />
            <StatCard label="Выполнено" value={stats.done} tone="green" />
          </section>
        </aside>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Список задач</h2>
              <p className="mt-1 text-sm text-slate-600">Найдено {tasks.length} {pluralizeTasks(tasks.length)}.</p>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-700/20 bg-white/70 p-10 text-center shadow-sm">
              <h3 className="text-xl font-semibold">По выбранным условиям задач нет</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Измените поисковый запрос или ослабьте фильтры, чтобы снова увидеть задачи.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  deleteAction={`/tasks/${task.id}/delete`}
                  toggleAction={`/tasks/${task.id}/toggle`}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </SiteShell>
  );
}

function FilterSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select name={name} defaultValue={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "slate" | "sky" | "red" | "green";
}) {
  const tones = {
    slate: "from-slate-900 to-slate-700 text-white",
    sky: "from-sky-700 to-cyan-600 text-white",
    red: "from-red-700 to-orange-500 text-white",
    green: "from-emerald-700 to-lime-600 text-white",
  } as const;

  return (
    <div className={`rounded-[1.75rem] bg-gradient-to-br p-5 shadow-[var(--shadow)] ${tones[tone]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function defaultSortDirection(sortBy?: string): TaskSortDirection {
  return sortBy === "priority" ? "desc" : "asc";
}

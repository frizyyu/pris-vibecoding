import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function NotFoundPage() {
  return (
    <SiteShell
      eyebrow="Не найдено"
      title="Страница не найдена"
      description="Запрошенный маршрут или задача отсутствует. Вернитесь к списку задач и выберите другой сценарий работы."
    >
      <section className="rounded-[2rem] border border-slate-700/10 bg-[var(--paper)] p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
        <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          Возможно, задача уже была удалена или адрес введён с ошибкой.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            К списку задач
          </Link>
          <Link
            href="/tasks/new"
            className="rounded-full border border-slate-800/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Создать задачу
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

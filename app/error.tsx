"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <section className="rounded-[2rem] border border-slate-700/10 bg-[var(--paper)] p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Ошибка приложения</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Не удалось отрендерить страницу</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Произошла ошибка во время загрузки интерфейса. Можно попробовать перезапустить рендер или вернуться к списку задач.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={reset}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Повторить
            </button>
            <Link
              href="/"
              className="rounded-full border border-slate-800/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              На главную
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

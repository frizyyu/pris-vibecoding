import Link from "next/link";

type SiteShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function SiteShell({ eyebrow, title, description, children }: SiteShellProps) {
  return (
    <main className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-slate-700/10 bg-[var(--paper)] p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">{eyebrow}</p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{description}</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-slate-800/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Все задачи
              </Link>
              <Link
                href="/tasks/new"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Добавить задачу
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}

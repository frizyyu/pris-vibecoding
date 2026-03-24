import { TaskForm } from "@/components/tasks/task-form";
import { SiteShell } from "@/components/site-shell";
import { getSearchParamValue } from "@/src/lib/task-response";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewTaskPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorMessage = getSearchParamValue(resolvedSearchParams.error);

  return (
    <SiteShell
      eyebrow="Создание"
      title="Новая задача"
      description="Быстро добавьте задачу, назначьте статус, приоритет и дедлайн."
    >
      <TaskForm action="/tasks/create" mode="create" errorMessage={errorMessage} />
    </SiteShell>
  );
}

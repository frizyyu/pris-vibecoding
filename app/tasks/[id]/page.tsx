import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskForm } from "@/components/tasks/task-form";
import { getSearchParamValue } from "@/src/lib/task-response";
import { taskService } from "@/src/lib/task-service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TaskDetailsPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorMessage = getSearchParamValue(resolvedSearchParams.error);
  const task = await taskService.getById(id);

  if (!task) {
    notFound();
  }

  return (
    <SiteShell
      eyebrow="Редактирование"
      title={task.title}
      description="Обновите описание, дедлайн или текущий статус задачи."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <TaskForm action={`/tasks/${task.id}/update`} mode="edit" task={task} errorMessage={errorMessage} />
        <TaskCard task={task} deleteAction={`/tasks/${task.id}/delete`} toggleAction={`/tasks/${task.id}/toggle`} showDetails />
      </div>
    </SiteShell>
  );
}

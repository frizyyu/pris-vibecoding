import { TaskBoard } from "@/components/tasks/task-board";
import { listOptionsFromSearchParams } from "@/src/lib/task-query";
import { taskService } from "@/src/lib/task-service";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const options = listOptionsFromSearchParams(resolvedSearchParams);
  const tasks = await taskService.list(options);

  return <TaskBoard tasks={tasks} filters={options} />;
}

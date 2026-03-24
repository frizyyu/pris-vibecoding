import { redirectWithStatus } from "@/src/lib/task-response";
import { taskService } from "@/src/lib/task-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  await taskService.remove(id);

  return redirectWithStatus(request, "/");
}

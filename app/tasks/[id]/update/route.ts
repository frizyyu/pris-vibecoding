import { readTaskInputFromFormData } from "@/src/lib/task-query";
import { redirectWithError, redirectWithStatus, toErrorMessage } from "@/src/lib/task-response";
import { taskService } from "@/src/lib/task-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await taskService.update(id, readTaskInputFromFormData(await request.formData()));
    return redirectWithStatus(request, `/tasks/${id}`);
  } catch (error) {
    return redirectWithError(request, `/tasks/${id}`, toErrorMessage(error, "Failed to update task."));
  }
}

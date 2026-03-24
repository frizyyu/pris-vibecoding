import { readTaskInputFromFormData } from "@/src/lib/task-query";
import { redirectWithError, redirectWithStatus, toErrorMessage } from "@/src/lib/task-response";
import { taskService } from "@/src/lib/task-service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const task = await taskService.create(readTaskInputFromFormData(formData));

    return redirectWithStatus(request, `/tasks/${task.id}`);
  } catch (error) {
    return redirectWithError(request, "/tasks/new", toErrorMessage(error, "Failed to create task."));
  }
}

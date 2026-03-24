import { NextResponse } from "next/server";
import { isTaskValidationError, toErrorMessage } from "@/src/lib/task-response";
import { taskService } from "@/src/lib/task-service";
import type { TaskCreateInput } from "@/src/lib/tasks";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const task = await taskService.getById(id);

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<TaskCreateInput>;
    const task = await taskService.update(id, body);

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: toErrorMessage(error, "Failed to update task.") },
      { status: isTaskValidationError(error) ? 400 : 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const removed = await taskService.remove(id);

  if (!removed) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

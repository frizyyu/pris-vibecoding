import { NextRequest, NextResponse } from "next/server";
import { listOptionsFromUrlSearchParams } from "@/src/lib/task-query";
import { isTaskValidationError, toErrorMessage } from "@/src/lib/task-response";
import { taskService } from "@/src/lib/task-service";
import type { TaskCreateInput } from "@/src/lib/tasks";

export async function GET(request: NextRequest) {
  const options = listOptionsFromUrlSearchParams(request.nextUrl.searchParams);
  const tasks = await taskService.list(options);
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TaskCreateInput;
    const task = await taskService.create(body);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: toErrorMessage(error, "Failed to create task.") },
      { status: isTaskValidationError(error) ? 400 : 500 },
    );
  }
}

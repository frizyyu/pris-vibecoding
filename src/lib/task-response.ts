import { NextResponse } from "next/server";
import { TaskValidationError } from "@/src/lib/tasks";

export function getSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function redirectWithStatus(request: Request, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 });
}

export function redirectWithError(request: Request, path: string, message: string): NextResponse {
  const url = new URL(path, request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}

export function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function isTaskValidationError(error: unknown): error is TaskValidationError {
  return error instanceof TaskValidationError;
}

import { NextResponse } from "next/server";
import { TaskValidationError } from "@/src/lib/tasks";

export function getSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function redirectWithStatus(request: Request, path: string): NextResponse {
  return NextResponse.redirect(resolveRedirectUrl(request, path), { status: 303 });
}

export function redirectWithError(request: Request, path: string, message: string): NextResponse {
  const url = resolveRedirectUrl(request, path);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}

export function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function isTaskValidationError(error: unknown): error is TaskValidationError {
  return error instanceof TaskValidationError;
}

function resolveRedirectUrl(request: Request, path: string): URL {
  if (/^https?:\/\//i.test(path)) {
    return new URL(path);
  }

  return new URL(path, getRequestOrigin(request));
}

function getRequestOrigin(request: Request): string {
  const requestUrl = new URL(request.url);
  const forwardedHost = readForwardedHeader(request.headers.get("x-forwarded-host"));
  const host = forwardedHost ?? request.headers.get("host");
  const forwardedProto = readForwardedHeader(request.headers.get("x-forwarded-proto"));
  const protocol = forwardedProto ?? requestUrl.protocol.replace(":", "");

  if (host) {
    return `${protocol}://${host}`;
  }

  return requestUrl.origin;
}

function readForwardedHeader(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value.split(",")[0]?.trim() || null;
}

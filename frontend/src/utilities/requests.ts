import { RequestMethods, RequestResolve } from "../types/requests";
import { CONTENT_TYPE } from "../constants/api";

export const request = async <Type>(
  method: RequestMethods,
  path: string,
  headers?: Record<string, string>,
  body?: string,
): Promise<RequestResolve<Type>> => {
  try {
    const requestHeaders = new Headers();
    for (const [key, value] of Object.entries(headers ?? {})) {
      requestHeaders.append(key, value);
    }
    requestHeaders.append("Content-Type", CONTENT_TYPE);
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body,
      credentials: "include",
    });
    if (res.ok) {
      return { data: await res.json() };
    }
    return { error: { status: res.status, message: "Request failed" } };
  } catch (error) {
    return { error: { status: 500, message: "Internal server error" } };
  }
};

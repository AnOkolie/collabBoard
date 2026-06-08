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
    try {
      const token = localStorage.getItem("token");
      if (token) {
        requestHeaders.append("Authorization", `Bearer ${token}`);
      }
    } catch (err) {}

    for (const [key, value] of Object.entries(headers ?? {})) {
      requestHeaders.append(key, value);
    }
    requestHeaders.append("Content-Type", CONTENT_TYPE);
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body,
    });
    if (res.ok) {
      return { data: await res.json() };
    }
    return { error: { status: res.status, message: await res.json() } };
  } catch (error) {
    return { error: { status: 500, message: "Internal server error" } };
  }
};

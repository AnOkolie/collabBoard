import { RequestMethods, RequestResolve } from "../types/requests";
import { CONTENT_TYPE } from "../constants/api";
import { refreshResponse } from "../types/auth";
import { useAuthStore } from "../zustand/authStore/useAuthStore";

export const request = async <Type>(
  method: RequestMethods,
  path: string,
  headers?: Record<string, string>,
  body?: string,
  retry = true,
): Promise<RequestResolve<Type>> => {
  try {
    const requestHeaders = new Headers();
    const { token, deleteToken, setToken } = useAuthStore.getState();
    try {
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
      credentials: "include",
    });
    if (res.ok) {
      return { data: await res.json() };
    }
    if (!res.ok) {
      const isAuthEndpoint =
        path.startsWith("auth/login") ||
        path.startsWith("auth/register") ||
        path.startsWith("auth/refresh");

      if (isAuthEndpoint) {
        return { error: await res.json() };
      }

      if (res.status === 401 && retry && !isAuthEndpoint) {
        // Handle unauthorized access (e.g., redirect to login or refresh token)
        console.warn("Unauthorized! Redirecting...");
        const refreshResponse = await request<refreshResponse>(
          RequestMethods.POST,
          "auth/refresh",
          undefined,
          undefined,
          false,
        );

        if (refreshResponse.error) {
          deleteToken();
          window.location.href = "/login";
          return {
            error: {
              status: 401,
              message: "Session expired",
            },
          };
        } else {
          const token = refreshResponse.data?.accessToken;
          if (!token) {
            window.location.href = "/login";
            return {
              error: {
                status: 401,
                message: "Session expired",
              },
            };
          }
          setToken(token);
          // localStorage.setItem("token", token);
        }

        return request<Type>(method, path, headers, body, false);
      }
    }
    return { error: { status: res.status, message: await res.json() } };
  } catch (error) {
    console.error("request error", error);
    return { error: { status: 500, message: "Internal server error catch" } };
  }
};

import { dashboardStats } from "../types/dashboard";
import { tasks } from "../types/cards";
import { RequestMethods, RequestResolve } from "../types/requests";
import { request } from "../utilities/requests";

export const getCompleteTasks = async (
  userId: string,
  startDate: string,
  endDate?: string,
): Promise<RequestResolve<tasks[]>> =>
  await request(
    RequestMethods.GET,
    `dashboard/complete/${userId}?startDate=${startDate}${endDate ? `/endDate=${endDate}` : ""}`,
  );

export const getIncompleteTask = async (
  userId: string,
): Promise<RequestResolve<tasks[]>> =>
  await request(RequestMethods.GET, `dashboard/incomplete/${userId}`);

export const getDashboardStats = async (
  userId: string,
): Promise<RequestResolve<dashboardStats>> =>
  await request(RequestMethods.GET, `dashboard/${userId}`);

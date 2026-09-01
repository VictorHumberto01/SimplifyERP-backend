import { IRoute } from "@/core/types/route";
import { accountRoutes } from "./account-routes";
import { authRoutes } from "./auth-routes";

export const identityAccessRoutes: IRoute[] = [
  { path: "/v1/auth", route: authRoutes },
  { path: "/v1/accounts", route: accountRoutes },
];

import { IRoute } from "@/core/types/route";
import { accountRoutes } from "./account-routes";
import { authRoutes } from "./auth-routes";
import { signupRoutes } from "./signup-routes";
import { moduleRoutes } from "./module-routes";

export const coreRoutes: IRoute[] = [
  { path: "/v1/auth", route: authRoutes },
  { path: "/v1/accounts", route: accountRoutes },
  { path: "/v1/signup", route: signupRoutes },
  { path: "/v1/establishment", route: moduleRoutes },
];

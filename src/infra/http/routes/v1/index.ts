import { IRoute } from "@/core/types/route";
import { coreRoutes } from "@/modules/core/http/routes";

const v1Routes: IRoute[] = [...coreRoutes];

export default v1Routes;

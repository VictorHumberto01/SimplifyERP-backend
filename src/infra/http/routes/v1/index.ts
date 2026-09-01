import { IRoute } from "@/core/types/route";
import { identityAccessRoutes } from "@/modules/identity-access/http/routes";

const v1Routes: IRoute[] = [...identityAccessRoutes];

export default v1Routes;

import { ModuleKey } from "@prisma/client";

export class EnabledModulePresenter {
  static toHttp(modules: { module: ModuleKey; enabled: boolean }[]) {
    return modules.map(({ module, enabled }) => ({ module, enabled }));
  }
}

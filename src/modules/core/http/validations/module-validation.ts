import { ModuleKey } from "@prisma/client";
import { boolean, mixed, object } from "yup";
import { TOGGLEABLE_MODULES } from "@/modules/core/use-cases/module/list-enabled-modules.use-case";

export class ModuleValidation {
  public static toggle() {
    return object({
      params: object({
        module: mixed<ModuleKey>().oneOf(TOGGLEABLE_MODULES, "Módulo inválido.").required("Módulo é obrigatório."),
      }),
      body: object({
        enabled: boolean().required("O campo 'enabled' é obrigatório."),
      }),
    });
  }
}

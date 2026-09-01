import { mixed, object, string } from "yup";
import { AccountRole } from "@/modules/identity-access/entities/value-objects/role";

export class AccountValidation {
  static show() {
    return object({
      params: object({
        accountId: string().uuid("ID da conta é inválido").required("ID da conta é obrigatório"),
      }),
    });
  }

  static update() {
    return object({
      params: object({
        accountId: string().uuid("ID da conta é inválido").required("ID da conta é obrigatório"),
      }),
      body: object({
        name: string().trim().min(2, "Nome inválido").optional(),
        email: string().email("Formato de e-mail inválido").optional(),
        role: mixed<AccountRole>().oneOf(Object.values(AccountRole)).optional(),
      }).noUnknown(true, "A atualização contém campos não permitidos"),
    });
  }
}

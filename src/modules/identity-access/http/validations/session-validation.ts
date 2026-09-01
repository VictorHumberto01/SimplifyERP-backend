import { object, string } from "yup";

export class SessionValidation {
  static revoke() {
    return object({
      params: object({
        sessionId: string().uuid("ID da sessão é inválido").required("ID da sessão é obrigatório"),
      }),
    });
  }
}

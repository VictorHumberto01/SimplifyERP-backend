import { object, string } from "yup";

const passwordSchema = string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .matches(/[A-Z]/, "A senha deve conter uma letra maiúscula")
  .matches(/[0-9]/, "A senha deve conter um número")
  .required("Senha é obrigatória");

export class AuthValidation {
  public static register() {
    return object({
      body: object({
        name: string().trim().min(2, "Nome inválido").required("Nome é obrigatório"),
        email: string().email("Formato de e-mail inválido").required("E-mail é obrigatório"),
        password: passwordSchema,
      }).noUnknown(true, "O cadastro contém campos não permitidos"),
    });
  }

  public static login() {
    return object({
      body: object({
        email: string().email("Formato de e-mail inválido").required("E-mail é obrigatório"),
        password: string().required("Senha é obrigatória"),
      }),
    });
  }

  public static refreshAuth() {
    return object({ body: object({ refreshToken: string().required("Token de atualização é obrigatório") }) });
  }

  public static forgotPassword() {
    return object({ body: object({ email: string().email("E-mail inválido").required("E-mail é obrigatório") }) });
  }

  public static resetPassword() {
    return object({ body: object({ token: string().required("Token é obrigatório"), newPassword: passwordSchema }) });
  }

  public static changePassword() {
    return object({
      body: object({
        currentPassword: string().required("Senha atual é obrigatória"),
        newPassword: passwordSchema,
      }),
    });
  }

  public static logout() {
    return object({ body: object({ refreshToken: string().required("Token de atualização é obrigatório") }) });
  }

  public static confirmMfa() {
    return object({
      body: object({
        code: string().length(6, "O código deve ter 6 dígitos").required("Código é obrigatório"),
      }),
    });
  }

  public static verifyMfa() {
    return object({
      body: object({
        mfaChallengeToken: string().required("Token de desafio é obrigatório"),
        code: string().length(6, "O código deve ter 6 dígitos").required("Código é obrigatório"),
      }),
    });
  }
}

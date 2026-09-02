import { object, string } from "yup";

export class SignupValidation {
  public static signup() {
    return object({
      body: object({
        ownerName: string().trim().min(2, "Nome inválido").required("Nome é obrigatório"),
        email: string().email("Formato de e-mail inválido").required("E-mail é obrigatório"),
        password: string()
          .min(8, "A senha deve ter no mínimo 8 caracteres")
          .matches(/[A-Z]/, "A senha deve conter uma letra maiúscula")
          .matches(/[0-9]/, "A senha deve conter um número")
          .required("Senha é obrigatória"),
        establishmentName: string().trim().min(2, "Nome do estabelecimento inválido").required("Nome do estabelecimento é obrigatório"),
        establishmentDocument: string().trim().nullable(),
      }).noUnknown(true, "O cadastro contém campos não permitidos"),
    });
  }
}

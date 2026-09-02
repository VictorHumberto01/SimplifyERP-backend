export interface ISignupDto {
  ownerName: string;
  email: string;
  password: string;
  establishmentName: string;
  establishmentDocument?: string | null;
  userAgent?: string | null;
  ip?: string | null;
}

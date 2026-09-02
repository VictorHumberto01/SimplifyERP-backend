import { BadRequestError } from '@/core/errors/bad-request.error';

export class Email {
  private readonly _value: string;
  private static EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private constructor(value: string) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static loadEmail(email: string): Email {
    if (!this.validateEmail(email)) {
      throw new BadRequestError('E-mail inválido.');
    }

    return new Email(email);
  }

  private static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }
}

import { Email } from '@/modules/core/entities/value-objects/email';
import { BadRequestError } from '@/core/errors/bad-request.error';

describe('Email Value Object', () => {
  describe('Email creation', () => {
    it('should create a new Email instance with valid email', () => {
      const email = Email.loadEmail('test@example.com');
      expect(email).toBeInstanceOf(Email);
      expect(email.value).toBe('test@example.com');
    });

    it('should reject invalid email format', () => {
      expect(() => {
        Email.loadEmail('invalid-email');
      }).toThrow(BadRequestError);
    });

    it('should reject email without domain', () => {
      expect(() => {
        Email.loadEmail('test@');
      }).toThrow(BadRequestError);
    });

    it('should reject email without @ symbol', () => {
      expect(() => {
        Email.loadEmail('testexample.com');
      }).toThrow(BadRequestError);
    });
  });
});

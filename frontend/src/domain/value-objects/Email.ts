import { InvalidEmailError } from "../errors/DomainError";

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): Email {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      throw new InvalidEmailError();
    }
    return new Email(value.toLowerCase().trim());
  }

  public getValue(): string {
    return this.value;
  }
}

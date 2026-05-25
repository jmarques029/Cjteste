import { InvalidNomeError } from "../errors/DomainError";

export class Nome {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): Nome {
    if (!value || value.trim().length < 3) {
      throw new InvalidNomeError();
    }
    return new Nome(value.trim());
  }

  public getValue(): string {
    return this.value;
  }
}

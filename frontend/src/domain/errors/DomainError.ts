export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidNomeError extends DomainError {
  constructor(message = "O nome deve conter pelo menos 3 caracteres.") {
    super(message);
  }
}

export class InvalidEmailError extends DomainError {
  constructor(message = "O e-mail informado não é válido.") {
    super(message);
  }
}

export class InvalidDocumentoError extends DomainError {
  constructor(message = "O CPF ou CNPJ informado é inválido.") {
    super(message);
  }
}

export class InvalidPlanoError extends DomainError {
  constructor(message = "Plano inválido ou não selecionado.") {
    super(message);
  }
}

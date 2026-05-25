import { Cliente } from "./Cliente";
import { InvalidPlanoError } from "../errors/DomainError";

export interface ContratacaoProps {
  planoId: number;
  cliente: Cliente;
}

export class Contratacao {
  private readonly planoId: number;
  private readonly cliente: Cliente;

  private constructor(planoId: number, cliente: Cliente) {
    this.planoId = planoId;
    this.cliente = cliente;
  }

  public static create(props: ContratacaoProps): Contratacao {
    if (!props.planoId || props.planoId <= 0) {
      throw new InvalidPlanoError();
    }
    return new Contratacao(props.planoId, props.cliente);
  }

  public getPlanoId(): number {
    return this.planoId;
  }

  public getCliente(): Cliente {
    return this.cliente;
  }

  public toJSON() {
    return {
      plano_id: this.planoId,
      cliente: this.cliente.toJSON(),
    };
  }
}

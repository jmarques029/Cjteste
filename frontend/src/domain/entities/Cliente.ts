import { Nome } from "../value-objects/Nome";
import { Email } from "../value-objects/Email";
import { Documento } from "../value-objects/Documento";

export interface ClienteProps {
  id?: number;
  nome: string;
  email: string;
  documento: string;
  documentoUrl?: string | null;
}

export class Cliente {
  private readonly id: number;
  private readonly nome: Nome;
  private readonly email: Email;
  private readonly documento: Documento;
  private readonly documentoUrl: string | null;

  private constructor(id: number, nome: Nome, email: Email, documento: Documento, documentoUrl: string | null) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.documento = documento;
    this.documentoUrl = documentoUrl;
  }

  public static create(props: ClienteProps): Cliente {
    const nomeVo = Nome.create(props.nome);
    const emailVo = Email.create(props.email);
    const documentoVo = Documento.create(props.documento);
    const id = props.id ?? 0;
    const documentoUrl = props.documentoUrl ?? null;

    return new Cliente(id, nomeVo, emailVo, documentoVo, documentoUrl);
  }

  public getId(): number {
    return this.id;
  }

  public getNome(): string {
    return this.nome.getValue();
  }

  public getEmail(): string {
    return this.email.getValue();
  }

  public getDocumento(): string {
    return this.documento.getValue();
  }

  public getDocumentoUrl(): string | null {
    return this.documentoUrl;
  }

  public toJSON() {
    return {
      id: this.id,
      nome: this.getNome(),
      email: this.getEmail(),
      documento: this.getDocumento(),
      documento_url: this.documentoUrl,
    };
  }
}

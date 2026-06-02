"use client";

import { useState, FormEvent } from "react";

interface EnderecoState {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface ToastState {
  type: "success" | "error" | "loading";
  title: string;
  message: string;
}

const BUTTON_SUBMIT_STYLE = {
  true: "btn btn-primary btn-full btn-lg opacity-70 cursor-not-allowed",
  false: "btn btn-primary btn-full btn-lg",
} as const;

const ESTADOS = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

export default function CadastroForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [endereco, setEndereco] = useState<EnderecoState>({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  function showToast(t: ToastState) {
    setToast(t);
    if (t.type !== "loading") {
      setTimeout(() => setToast(null), 6000);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      showToast({
        type: "error",
        title: "Senhas não conferem",
        message: "A senha e a confirmação de senha precisam ser iguais.",
      });
      return;
    }

    if (senha.length < 6) {
      showToast({
        type: "error",
        title: "Senha muito curta",
        message: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    showToast({
      type: "loading",
      title: "Cadastrando...",
      message: "Aguarde enquanto processamos seus dados.",
    });

    setIsSubmitting(true);

    try {
      const form = new FormData(e.currentTarget);
      const payload = {
        nome: form.get("nome") as string,
        email: form.get("email") as string,
        documento: form.get("documento") as string,
        telefone: form.get("telefone") as string,
        senha: form.get("senha") as string,
        endereco: {
          cep: form.get("cep") as string,
          logradouro: form.get("logradouro") as string,
          numero: form.get("numero") as string,
          complemento: form.get("complemento") as string,
          bairro: form.get("bairro") as string,
          cidade: form.get("cidade") as string,
          estado: form.get("estado") as string,
        },
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail ?? "Erro ao realizar cadastro.");
      }

      showToast({
        type: "success",
        title: "Cadastro realizado! 🎉",
        message: "Sua conta foi criada com sucesso. Faça login para continuar.",
      });

      e.currentTarget.reset();
      setSenha("");
      setConfirmarSenha("");
      setEndereco({
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Erro no cadastro",
        message: err.message || "Não foi possível completar o cadastro.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateEndereco(field: keyof EnderecoState, value: string) {
    setEndereco((prev) => ({ ...prev, [field]: value }));
  }

  const toastIcon = toast?.type === "success" ? "✅" : toast?.type === "error" ? "❌" : "⏳";

  return (
    <>
      <form
        className="form-section"
        onSubmit={handleSubmit}
        aria-label="Formulário de cadastro"
        noValidate
      >
        <h2 className="form-title">Criar sua conta</h2>
        <p className="form-subtitle">
          Preencha seus dados para se cadastrar e ter acesso a todos os benefícios CJnet.
        </p>

        <div className="form-notice">
          <span>🔒</span>
          Seus dados estão protegidos e nunca serão compartilhados.
        </div>

        <div className="form-grid">
          <div className="form-group full">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Seu nome completo"
              required
              minLength={3}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="voce@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="documento">CPF / CNPJ</label>
            <input
              id="documento"
              name="documento"
              type="text"
              placeholder="000.000.000-00"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              placeholder="(11) 99999-9999"
              required
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmar-senha">Confirmar senha</label>
            <input
              id="confirmar-senha"
              type="password"
              placeholder="Repita a senha"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" }} />

        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "20px", letterSpacing: "-0.3px" }}>
          Endereço de instalação
        </h3>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="cep">CEP</label>
            <input
              id="cep"
              name="cep"
              type="text"
              placeholder="00000-000"
              required
              value={endereco.cep}
              onChange={(e) => updateEndereco("cep", e.target.value)}
            />
          </div>

          <div className="form-group full">
            <label htmlFor="logradouro">Logradouro</label>
            <input
              id="logradouro"
              name="logradouro"
              type="text"
              placeholder="Rua, Avenida..."
              required
              value={endereco.logradouro}
              onChange={(e) => updateEndereco("logradouro", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="numero">Número</label>
            <input
              id="numero"
              name="numero"
              type="text"
              placeholder="Nº"
              required
              value={endereco.numero}
              onChange={(e) => updateEndereco("numero", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="complemento">Complemento</label>
            <input
              id="complemento"
              name="complemento"
              type="text"
              placeholder="Apto, Bloco..."
              value={endereco.complemento}
              onChange={(e) => updateEndereco("complemento", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bairro">Bairro</label>
            <input
              id="bairro"
              name="bairro"
              type="text"
              placeholder="Seu bairro"
              required
              value={endereco.bairro}
              onChange={(e) => updateEndereco("bairro", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cidade">Cidade</label>
            <input
              id="cidade"
              name="cidade"
              type="text"
              placeholder="Sua cidade"
              required
              value={endereco.cidade}
              onChange={(e) => updateEndereco("cidade", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              required
              value={endereco.estado}
              onChange={(e) => updateEndereco("estado", e.target.value)}
            >
              <option value="">Selecione</option>
              {ESTADOS.map((uf) => (
                <option key={uf.sigla} value={uf.sigla}>
                  {uf.sigla} — {uf.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <br />

        <button
          type="submit"
          disabled={isSubmitting}
          className={BUTTON_SUBMIT_STYLE[String(isSubmitting) as "true" | "false"]}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Cadastrando...
            </>
          ) : (
            "Criar Conta →"
          )}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Já tem conta?{" "}
          <a href="/" style={{ color: "var(--accent-light)", textDecoration: "none", fontWeight: 600 }}>
            Faça login
          </a>
        </p>
      </form>

      {toast && (
        <div className={`toast ${toast.type}`} role="alert" aria-live="assertive">
          <span className="toast-icon">{toastIcon}</span>
          <div>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-msg">{toast.message}</div>
          </div>
        </div>
      )}
    </>
  );
}

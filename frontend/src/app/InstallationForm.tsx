"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import UploadField from "./components/UploadField";
import { useAuth } from "../presentation/hooks/useAuth";
import { useContratacao, SolicitacaoItem } from "../presentation/hooks/useContratacao";
import { usePlanos } from "../presentation/hooks/usePlanos";
import { DomainError } from "../domain/errors/DomainError";

interface ToastState {
  type: "success" | "error" | "loading";
  title: string;
  message: string;
}

// O(1) dictionary maps for Tailwind styling to optimize performance and remove If/Else complex chains
const BUTTON_SUBMIT_STYLE = {
  true: "btn btn-primary btn-full btn-lg opacity-70 cursor-not-allowed",
  false: "btn btn-primary btn-full btn-lg",
} as const;

const BADGE_STATUS_STYLE = {
  Pendente: "status-badge status-pending",
  Confirmado: "status-badge status-confirmed",
  Falhou: "status-badge status-failed",
} as const;

export default function InstallationForm() {
  const { data: plansList = [] } = usePlanos();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [documentoUrl, setDocumentoUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estados de Login e Contratação via Custom Hooks
  const { isLoggedIn, login, error: loginError, loading: loginLoading, logout } = useAuth();
  const { solicitacoes, solicitar, isSubmitting } = useContratacao();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Pré-selecionar plano a partir do hash de URL (ex: #contratar?plano_id=2)
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash;
      if (!hash.startsWith("#contratar")) return;
      const query = hash.replace("#contratar?", "");
      const params = new URLSearchParams(query);
      const pid = params.get("plano_id");
      if (pid) setSelectedPlanId(pid);
    }
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  function showToast(t: ToastState) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(t);
    if (t.type !== "loading") {
      toastTimerRef.current = setTimeout(() => setToast(null), 6000);
    }
  }

  const plans = plansList;

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    const success = await login(loginUsername, loginPassword);
    if (success) {
      showToast({
        type: "success",
        title: "Login efetuado com sucesso!",
        message: "Agora você pode prosseguir com a solicitação de instalação.",
      });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const planId = parseInt(data.get("plano_id") as string, 10);
    if (!planId) {
      showToast({
        type: "error",
        title: "Plano não selecionado",
        message: "Escolha um plano antes de continuar.",
      });
      return;
    }

    const planName = plans.find((p) => p.id === planId)?.nome ?? "Plano";

    showToast({
      type: "loading",
      title: "Enviando...",
      message: "Aguarde enquanto validamos os dados no domínio e processamos.",
    });

    try {
      // Invoca a contratação via hook de mutação otimista
      await solicitar({
        planoId: planId,
        planoNome: planName,
        nome: data.get("nome") as string,
        email: data.get("email") as string,
        documento: data.get("documento") as string,
        documentoUrl,
      });

      showToast({
        type: "success",
        title: "Contratação enviada! 🎉",
        message: "Sua contratação foi registrada. Em breve agendaremos sua instalação.",
      });

      form.reset();
      setSelectedPlanId("");
      setDocumentoUrl(null);
    } catch (err: any) {
      if (err instanceof DomainError) {
        showToast({
          type: "error",
          title: "Erro de Domínio (Fail-Fast)",
          message: err.message,
        });
      } else {
        showToast({
          type: "error",
          title: "Falha de Conexão (Rollback)",
          message: err.message || "Erro ao conectar-se à API externa.",
        });
      }
    }
  }

  const toastIcon = toast?.type === "success" ? "✅" : toast?.type === "error" ? "❌" : "⏳";

  if (!isLoggedIn) {
    return (
      <form
        className="form-section"
        onSubmit={handleLogin}
        aria-label="Login para contratação"
        noValidate
      >
        <h2 className="form-title">Faça login para contratar</h2>
        <p className="form-subtitle">
          Acesse sua conta de cliente para prosseguir com a contratação do plano.
        </p>

        <div className="form-grid">
          <div className="form-group full">
            <label htmlFor="loginUsername">Usuário</label>
            <input
              id="loginUsername"
              type="text"
              placeholder="Digite seu usuário"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group full">
            <label htmlFor="loginPassword">Senha</label>
            <input
              id="loginPassword"
              type="password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {loginError && (
          <div className="text-red-400 text-sm font-medium p-3 bg-red-400/10 border border-red-400/20 rounded-lg mt-4 mb-4">
            {loginError}
          </div>
        )}

        <br />

        <button
          type="submit"
          disabled={loginLoading}
          className={BUTTON_SUBMIT_STYLE[String(loginLoading) as "true" | "false"]}
        >
          {loginLoading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Entrando...
            </>
          ) : (
            "Entrar e Continuar →"
          )}
        </button>
      </form>
    );
  }

  return (
    <>
      <div className="installation-layout">
        <form
          id="installation-form"
          className="form-section"
          onSubmit={handleSubmit}
          aria-label="Formulário de contratação"
          noValidate
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="form-title">Solicitar Instalação</h2>
            <button
              type="button"
              onClick={logout}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: "12px", border: "1px solid #3f3f46" }}
            >
              Sair da Conta 🚪
            </button>
          </div>
          <p className="form-subtitle">
            Preencha seus dados e nossa equipe entrará em contato em até 24 horas.
          </p>

          <div className="form-notice">
            <span>🔒</span>
            Seus dados são protegidos e nunca serão compartilhados.
          </div>

          <div className="form-grid">
            {/* Nome completo */}
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

            {/* Email */}
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

            {/* Documento */}
            <div className="form-group">
              <label htmlFor="documento">CPF / CNPJ</label>
              <input
                id="documento"
                name="documento"
                type="text"
                placeholder="000.000.000-00 ou CNPJ"
                required
              />
            </div>

            {/* Plano */}
            <div className="form-group full">
              <label htmlFor="plano_id">Plano de interesse</label>
              <select
                id="plano_id"
                name="plano_id"
                required
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
              >
                <option value="">Selecione um plano</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — {p.velocidade_mbps} Mbps — R$ {p.preco.toFixed(2).replace(".", ",")}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload de Identidade */}
            <UploadField onUploadSuccess={(path) => setDocumentoUrl(path)} />
          </div>

          <br />

          <button
            id="btn-submit-form"
            type="submit"
            disabled={isSubmitting}
            className={BUTTON_SUBMIT_STYLE[String(isSubmitting) as "true" | "false"]}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Enviando...
              </>
            ) : (
              "Solicitar Instalação →"
            )}
          </button>
        </form>

        {/* Dashboard de Solicitações Recentes (B2B Dashboard) para demonstrar Atualizações Otimistas e Rollback */}
        <div className="solicitacoes-recentes-container" style={{ marginTop: "30px" }}>
          <h3 className="solicitacoes-title">
            📋 Minhas Solicitações Recentes
            <span className="badge-b2b">Offline LocalStorage Cache</span>
          </h3>
          <p className="solicitacoes-subtitle">
            Acompanhe o estado de suas contratações de forma instantânea.
          </p>

          {solicitacoes.length === 0 ? (
            <div className="solicitacoes-empty">
              Nenhuma solicitação realizada neste navegador ainda.
            </div>
          ) : (
            <div className="solicitacoes-list" role="list">
              {solicitacoes.map((item) => (
                <div key={item.id} className="solicitacao-card" role="listitem">
                  <div className="solicitacao-header">
                    <span className="solicitacao-plano">{item.planoNome}</span>
                    <span className={BADGE_STATUS_STYLE[item.status]}>
                      {item.status === "Pendente" && <span className="mini-spinner" />}
                      {item.status}
                    </span>
                  </div>
                  <div className="solicitacao-body">
                    <div><strong>Cliente:</strong> {item.nome}</div>
                    <div><strong>Doc:</strong> {item.documento}</div>
                  </div>
                  <div className="solicitacao-footer">
                    <span>Enviado às: {item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
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

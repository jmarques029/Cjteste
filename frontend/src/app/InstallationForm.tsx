"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import UploadField from "./components/UploadField";

interface ToastState {
  type: "success" | "error" | "loading";
  title: string;
  message: string;
}

interface Plan {
  id: number;
  nome: string;
  velocidade_mbps: number;
  preco: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function InstallationForm() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [documentoUrl, setDocumentoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estados de Login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Verifica se já está logado
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  // Carregar planos para o <select>
  useEffect(() => {
    fetch(`${API_URL}/planos/`)
      .then((r) => r.json())
      .then((data: Plan[]) => setPlans(data))
      .catch(() => {
        setPlans([
          { id: 1, nome: "Essencial 100", velocidade_mbps: 100, preco: 79.9 },
          { id: 2, nome: "Turbo 300", velocidade_mbps: 300, preco: 109.9 },
          { id: 3, nome: "Ultra 600", velocidade_mbps: 600, preco: 149.9 },
        ]);
      });
  }, []);

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
      toastTimerRef.current = setTimeout(() => setToast(null), 5000);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: loginUsername, password: loginPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        setIsLoggedIn(true);
        // Despacha evento para que o Header ou outros componentes percebam o login
        window.dispatchEvent(new Event("storage"));
      } else {
        setLoginError("Usuário ou senha incorretos.");
      }
    } catch (err) {
      setLoginError("Erro de conexão com o servidor.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const planId = parseInt(data.get("plano_id") as string, 10);
    if (!planId) {
      showToast({ type: "error", title: "Plano não selecionado", message: "Escolha um plano antes de continuar." });
      return;
    }

    setLoading(true);
    showToast({ type: "loading", title: "Enviando...", message: "Aguarde enquanto processamos sua solicitação." });

    const token = localStorage.getItem("token") || "";

    // Montar payload
    const payload = {
      plano_id: planId,
      cliente: {
        nome: data.get("nome") as string,
        email: data.get("email") as string,
        documento: data.get("documento") as string,
        documento_url: documentoUrl, // Inclui o path do arquivo enviado
      },
    };

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/contratacao/`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        showToast({
          type: "success",
          title: "Contratação enviada! 🎉",
          message: result.mensagem ?? "Em breve entraremos em contato para agendar a instalação.",
        });
        form.reset();
        setSelectedPlanId("");
        setDocumentoUrl(null);
      } else if (res.status === 422) {
        const err = await res.json();
        showToast({
          type: "error",
          title: "Dados inválidos",
          message: err.detail?.[0]?.msg ?? "Verifique os campos preenchidos.",
        });
      } else {
        showToast({ type: "error", title: "Erro no servidor", message: "Tente novamente em alguns instantes." });
      }
    } catch {
      showToast({ type: "error", title: "Sem conexão", message: "Não foi possível conectar à API." });
    } finally {
      setLoading(false);
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
          className={`btn btn-primary btn-full btn-lg`}
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
      <form
        id="installation-form"
        className="form-section"
        onSubmit={handleSubmit}
        aria-label="Formulário de contratação"
        noValidate
      >
        <h2 className="form-title">Solicitar Instalação</h2>
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
              placeholder="000.000.000-00"
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
          disabled={loading}
          className={`btn btn-primary btn-full btn-lg`}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Enviando...
            </>
          ) : (
            "Solicitar Instalação →"
          )}
        </button>
      </form>

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

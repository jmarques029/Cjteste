"use client";

import { useState, FormEvent } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        onClose();
        // Recarregar para atualizar estado global (ou usar um context se fosse prod real)
        window.location.reload();
      } else {
        setError("Usuário ou senha incorretos.");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#16161f] border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl animate-slide-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Área do Cliente</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="username" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a0a0be', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Usuário</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              required
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#f0f0ff', padding: '12px', width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a0a0be', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#f0f0ff', padding: '12px', width: '100%' }}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm font-medium p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary btn-full btn-lg mt-4`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Ainda não é cliente?{" "}
          <a href="/cadastro" onClick={onClose} className="text-[#6366f1] hover:underline">Cadastre-se</a>
          {" ou "}
          <a href="#planos" onClick={onClose} className="text-[#6366f1] hover:underline">Ver planos</a>
        </p>
      </div>
    </div>
  );
}

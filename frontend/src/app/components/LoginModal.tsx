"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "../../presentation/hooks/useAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error: authError } = useAuth();

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      onClose();
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

          {authError && (
            <div className="text-red-400 text-sm font-medium p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
              {authError}
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

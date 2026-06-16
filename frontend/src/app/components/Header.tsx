"use client";

import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import { BrowserStorage } from "../../infrastructure/storage/BrowserStorage";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!BrowserStorage.getToken());
    };

    checkToken();
    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  const handleLogout = () => {
    BrowserStorage.removeToken();
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <>
      <header>
        <nav className="navbar" role="navigation" aria-label="Menu principal">
          <div className="container">
            <div className="navbar-inner">
              <a href="#inicio" className="logo" aria-label="CJnet — Página inicial">
                <span className="logo-icon" aria-hidden="true">🌐</span>
                CJnet
              </a>

              <ul className="nav-links" role="list">
                <li><a href="/#vantagens">Vantagens</a></li>
                <li><a href="/#planos">Planos</a></li>
                <li><a href="/#contratar">Contratar</a></li>
                <li><a href="/cadastro">Cadastre-se</a></li>
                {isLoggedIn ? (
                   <li><button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>Sair</button></li>
                ) : (
                   <li><button onClick={() => setIsLoginOpen(true)} className="text-gray-400 hover:text-white transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>Área do Cliente</button></li>
                )}
              </ul>

              <a href="#contratar" className="btn btn-primary" id="btn-nav-contratar">
                Contratar Agora
              </a>
            </div>
          </div>
        </nav>
      </header>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}

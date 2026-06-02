import CadastroForm from "../components/CadastroForm";

export default function CadastroPage() {
  return (
    <>
      <header>
        <nav className="navbar" role="navigation" aria-label="Menu principal">
          <div className="container">
            <div className="navbar-inner">
              <a href="/" className="logo" aria-label="CJnet — Página inicial">
                <span className="logo-icon" aria-hidden="true">🌐</span>
                CJnet
              </a>

              <ul className="nav-links" role="list">
                <li><a href="/#vantagens">Vantagens</a></li>
                <li><a href="/#planos">Planos</a></li>
                <li><a href="/#contratar">Contratar</a></li>
              </ul>

              <a href="/" className="btn btn-outline btn-lg">
                Entrar
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="section" aria-label="Formulário de cadastro">
          <div className="container">
            <CadastroForm />
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-inner">
            <p className="footer-copy">
              © {new Date().getFullYear()} CJnet. Todos os direitos reservados.
            </p>
            <nav className="footer-links" aria-label="Links do rodapé">
              <a href="#">Política de Privacidade</a>
              <a href="#">Termos de Serviço</a>
              <a href="/">Área do Cliente</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}

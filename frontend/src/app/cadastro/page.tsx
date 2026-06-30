import CadastroForm from "../components/CadastroForm";
import Header from "../components/Header";

export default function CadastroPage() {
  return (
    <>
      <Header />

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

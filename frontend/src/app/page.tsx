import { Suspense } from "react";
import PlansGrid from "./PlansGrid";
import InstallationForm from "./InstallationForm";
import Header from "./components/Header";

function HeroSection() {
  return (
    <section className="hero" id="inicio" aria-label="Seção principal">
      <div className="container">
        <div className="hero-badge">
          <span className="dot" aria-hidden="true" />
          Fibra Óptica de Verdade
        </div>

        <h1 className="hero-title">
          Internet que{" "}
          <span className="highlight">não para,</span>
          <br />
          velocidade que{" "}
          <span className="highlight">impressiona.</span>
        </h1>

        <p className="hero-subtitle">
          Tecnologia de fibra óptica com cobertura em toda a região. Planos flexíveis,
          instalação rápida e suporte humano — sem robôs.
        </p>

        <div className="hero-actions">
          <a href="#planos" className="btn btn-primary btn-lg" id="btn-ver-planos">
            Ver Planos
          </a>
          <a href="#contratar" className="btn btn-ghost btn-lg" id="btn-contratar-hero">
            Solicitar Instalação
          </a>
        </div>

        <div className="hero-stats" role="list" aria-label="Números do provedor">
          <div className="stat-item" role="listitem">
            <div className="stat-value">99,9%</div>
            <div className="stat-label">Disponibilidade</div>
          </div>
          <div className="stat-item" role="listitem">
            <div className="stat-value">+15k</div>
            <div className="stat-label">Clientes Ativos</div>
          </div>
          <div className="stat-item" role="listitem">
            <div className="stat-value">24h</div>
            <div className="stat-label">Suporte Técnico</div>
          </div>
          <div className="stat-item" role="listitem">
            <div className="stat-value">1 Gbps</div>
            <div className="stat-label">Velocidade Máx.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Server Component: Features ---- */
function FeaturesSection() {
  const features = [
    {
      icon: "⚡",
      title: "Ultra Velocidade",
      desc: "Até 1 Gbps simétrico com latência abaixo de 5ms para gaming e streaming sem interrupcões.",
    },
    {
      icon: "🛡️",
      title: "Rede Segura",
      desc: "Proteção contra DDoS e firewall de borda inclusos em todos os planos sem custo adicional.",
    },
    {
      icon: "📞",
      title: "Suporte 24/7",
      desc: "Técnicos humanos disponíveis a qualquer hora. Sem robôs, sem espera de horas.",
    },
    {
      icon: "🏠",
      title: "Instalação em 24h",
      desc: "Agendamento no mesmo dia e instalação profissional sem cobranças extras na primeira vez.",
    },
  ];

  return (
    <section className="section" id="vantagens" aria-label="Vantagens CJnet">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Por que nos escolher</span>
          <h2 className="section-title">A internet que você merece</h2>
          <p className="section-desc">
            Mais que velocidade — oferecemos estabilidade, segurança e um suporte que
            realmente resolve.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title} role="article">
              <div className="feature-icon" aria-hidden="true">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Fallback para o PlansGrid (loading) ---- */
function PlansSkeleton() {
  return (
    <div className="plans-grid" aria-busy="true" aria-label="Carregando planos...">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="plan-card"
          style={{
            background: "linear-gradient(145deg, #16161f, #1a1a28)",
            minHeight: 420,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

/* ---- Root Page ---- */
export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <HeroSection />

        <div className="divider" />

        {/* Vantagens */}
        <FeaturesSection />

        <div className="divider" />

        {/* Planos */}
        <section className="section" id="planos" aria-label="Planos disponíveis">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Planos e Preços</span>
              <h2 className="section-title">Escolha o plano ideal</h2>
              <p className="section-desc">
                Fibra óptica em todos os planos. Sem mensalidade de adesão,
                sem surpresas na fatura.
              </p>
            </div>

            <Suspense fallback={<PlansSkeleton />}>
              <PlansGrid />
            </Suspense>
          </div>
        </section>

        <div className="divider" />

        {/* Formulário de Contratação */}
        <section
          className="section"
          id="contratar"
          aria-label="Solicitar instalação"
          style={{ scrollMarginTop: "80px" }}
        >
          <div className="container">
            <div className="section-header">
              <span className="section-label">Contratação Online</span>
              <h2 className="section-title">Solicite sua instalação</h2>
              <p className="section-desc">
                Preencha o formulário e nossa equipe agenda sua instalação em até 24 horas.
              </p>
            </div>

            <InstallationForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-inner">
            <p className="footer-copy">
              © {new Date().getFullYear()} CJnet. Todos os direitos reservados.
            </p>
            <nav className="footer-links" aria-label="Links do rodapé">
              <a href="#">Política de Privacidade</a>
              <a href="#">Termos de Serviço</a>
              <a href="#">Área do Cliente</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}

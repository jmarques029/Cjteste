// Componente Server — renderiza card individual de plano
interface Plan {
  id: number;
  nome: string;
  preco: number;
  velocidade_mbps: number;
}

interface PlanCardProps {
  plan: Plan;
  featured?: boolean;
}

const PLAN_FEATURES = [
  "Fibra óptica simétrica",
  "IP fixo disponível",
  "Sem fidelidade obrigatória",
  "Suporte técnico 24h",
];

function getSpeedLabel(speed: number): string {
  if (speed >= 1000) return `${speed / 1000} Gbps`;
  return `${speed} Mbps`;
}

function getBadgeLabel(plan: { nome: string; velocidade_mbps: number }): string {
  if (plan.velocidade_mbps >= 500) return "⚡ Alta Performance";
  if (plan.velocidade_mbps >= 200) return "🚀 Mais Vendido";
  return "✅ Inicial";
}

export default function PlanCard({ plan, featured }: PlanCardProps) {
  const cardClass = `plan-card${featured ? " featured" : ""}`;
  const priceInt = Math.floor(plan.preco);
  const priceCents = Math.round((plan.preco - priceInt) * 100)
    .toString()
    .padStart(2, "0");

  return (
    <article className={cardClass} id={`plan-card-${plan.id}`}>
      <div className="plan-badge">{getBadgeLabel(plan)}</div>

      <h3 className="plan-name">{plan.nome}</h3>
      <p className="plan-description">
        Navegue sem limites com tecnologia de fibra óptica de última geração
        diretamente na sua residência.
      </p>

      <div className="plan-price">
        <span className="currency">R$</span>
        <span className="amount">{priceInt}</span>
        <span className="currency">,{priceCents}</span>
        <span className="period">/mês</span>
      </div>

      <div className="plan-speed" role="note" aria-label={`Velocidade: ${getSpeedLabel(plan.velocidade_mbps)}`}>
        <span className="speed-icon">🌐</span>
        <div>
          <div className="speed-value">{getSpeedLabel(plan.velocidade_mbps)}</div>
          <div className="speed-label">download / upload</div>
        </div>
      </div>

      <ul className="plan-features" aria-label="Benefícios do plano">
        {PLAN_FEATURES.map((feat) => (
          <li key={feat}>
            <span className="check">✓</span>
            {feat}
          </li>
        ))}
      </ul>

      {/* anchor scrolls to the form section */}
      <a
        href={`#contratar?plano_id=${plan.id}&nome=${encodeURIComponent(plan.nome)}`}
        className={`btn btn-full ${featured ? "btn-primary" : "btn-outline"}`}
        id={`btn-contratar-${plan.id}`}
        aria-label={`Contratar plano ${plan.nome}`}
      >
        {featured ? "Contratar Agora" : "Escolher Plano"}
      </a>
    </article>
  );
}

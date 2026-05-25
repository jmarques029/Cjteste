import { Plan } from "../domain/repositories/IContratacaoRepository";

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

// O(1) dictionary style maps to eliminate complex If/Else or ternary logic
const CARD_FEATURED_STYLE = {
  true: "plan-card featured",
  false: "plan-card",
} as const;

const BUTTON_FEATURED_STYLE = {
  true: "btn btn-full btn-primary",
  false: "btn btn-full btn-outline",
} as const;

function getSpeedLabel(speed: number): string {
  return speed >= 1000 ? `${speed / 1000} Gbps` : `${speed} Mbps`;
}

function getBadgeLabel(speed: number): string {
  // Constant time style key lookup
  const category = speed >= 500 ? "high" : speed >= 200 ? "medium" : "low";
  const BADGE_MAP = {
    high: "⚡ Alta Performance",
    medium: "🚀 Mais Vendido",
    low: "✅ Inicial",
  } as const;
  return BADGE_MAP[category];
}

export default function PlanCard({ plan, featured = false }: PlanCardProps) {
  const cardClass = CARD_FEATURED_STYLE[String(featured) as "true" | "false"];
  const buttonClass = BUTTON_FEATURED_STYLE[String(featured) as "true" | "false"];
  const priceInt = Math.floor(plan.preco);
  const priceCents = Math.round((plan.preco - priceInt) * 100)
    .toString()
    .padStart(2, "0");

  return (
    <article className={cardClass} id={`plan-card-${plan.id}`}>
      <div className="plan-badge">{getBadgeLabel(plan.velocidade_mbps)}</div>

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

      <a
        href={`#contratar?plano_id=${plan.id}&nome=${encodeURIComponent(plan.nome)}`}
        className={buttonClass}
        id={`btn-contratar-${plan.id}`}
        aria-label={`Contratar plano ${plan.nome}`}
      >
        {featured ? "Contratar Agora" : "Escolher Plano"}
      </a>
    </article>
  );
}

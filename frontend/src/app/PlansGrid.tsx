"use client";

import PlanCard from "./PlanCard";
import { usePlanos } from "../presentation/hooks/usePlanos";

export default function PlansGrid() {
  const { data: plans, isLoading, isError } = usePlanos();

  if (isLoading) {
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

  // Se der erro ou se a lista retornar vazia, fornecer fallback de apresentação do negócio
  const displayPlans = isError || !plans || plans.length === 0
    ? [
        { id: 1, nome: "Essencial 100", preco: 79.9, velocidade_mbps: 100 },
        { id: 2, nome: "Turbo 300", preco: 109.9, velocidade_mbps: 300 },
        { id: 3, nome: "Ultra 600", preco: 149.9, velocidade_mbps: 600 },
      ]
    : plans;

  const featuredIndex = displayPlans.length > 1 ? 1 : 0;

  return (
    <div className="plans-grid">
      {displayPlans.map((plan, i) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          featured={i === featuredIndex}
        />
      ))}
    </div>
  );
}

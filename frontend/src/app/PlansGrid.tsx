"use client";

import PlanCard from "./PlanCard";
import { usePlanos } from "../presentation/hooks/usePlanos";

export default function PlansGrid() {
  const { data: plans, isLoading, isError, refetch } = usePlanos();

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

  if (isError || !plans || plans.length === 0) {
    return (
      <div className="plans-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="plan-card" style={{ textAlign: "center", padding: "40px", color: "#a0a0be" }}>
          <p style={{ marginBottom: "20px" }}>Nenhum plano disponível no momento.</p>
          <button
            onClick={() => refetch()}
            className="btn btn-outline"
            style={{ margin: "0 auto", display: "inline-flex", cursor: "pointer" }}
            id="btn-retry-plans"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const featuredIndex = plans.length > 1 ? 1 : 0;

  return (
    <div className="plans-grid">
      {plans.map((plan, i) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          featured={i === featuredIndex}
        />
      ))}
    </div>
  );
}

// Componente Server — busca planos via SSR da API interna do container
import PlanCard from "./PlanCard";

interface Plan {
  id: number;
  nome: string;
  preco: number;
  velocidade_mbps: number;
}

async function getPlans(): Promise<Plan[]> {
  const apiUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/planos/`, {
      next: { revalidate: 60 }, // ISR: revalida a cada 60s
    });
    if (!res.ok) return getMockPlans();
    return res.json();
  } catch {
    return getMockPlans();
  }
}

function getMockPlans(): Plan[] {
  return [
    { id: 1, nome: "Essencial 100", preco: 79.9, velocidade_mbps: 100 },
    { id: 2, nome: "Turbo 300", preco: 109.9, velocidade_mbps: 300 },
    { id: 3, nome: "Ultra 600", preco: 149.9, velocidade_mbps: 600 },
  ];
}

export default async function PlansGrid() {
  const plans = await getPlans();
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

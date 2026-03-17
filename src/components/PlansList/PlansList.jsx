import React from 'react';
import PlanCard from '../PlanCard/PlanCard';
import './PlansList.css';

function PlansList({ plans }) {
  return (
    <div className="plans-list-container">
      <h2 className="section-title">Choose Your Speed</h2>
      <div className="plans-grid">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} recommended={plan.recommended} />
        ))}
      </div>
    </div>
  );
}

export default PlansList;

import React from 'react';
import './PlanCard.css';

function PlanCard({ plan, recommended }) {
  return (
    <div className={`plan-card glass ${recommended ? 'recommended' : ''}`}>
      {recommended && <div className="badge">Recommended</div>}
      <h3>{plan.name}</h3>
      <div className="speed">{plan.speed}</div>
      <div className="price">
        <span className="currency">$</span>
        <span className="amount">{plan.price}</span>
        <span className="period">/mo</span>
      </div>
      <ul className="features">
        {plan.features.map((feature, index) => (
          <li key={index}>
            <span className="check">✓</span> {feature}
          </li>
        ))}
      </ul>
      <button className="btn btn-primary">Select Plan</button>
    </div>
  );
}

export default PlanCard;

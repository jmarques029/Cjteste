import React, { useState } from 'react';
import LeadForm from './components/LeadForm/LeadForm';
import PlansList from './components/PlansList/PlansList';
import InstallationForm from './components/InstallationForm/InstallationForm';
import './App.css';

const MOCK_PLANS = [
  {
    id: 1,
    name: 'Essential Fiber',
    speed: '300 Mbps',
    price: '99',
    features: ['Unlimited Data', 'Free Installation', 'Wi-Fi 5 Router'],
  },
  {
    id: 2,
    name: 'Advanced Fiber',
    speed: '600 Mbps',
    price: '149',
    features: ['Unlimited Data', 'Priority Support', 'Wi-Fi 6 Router', 'Free Streaming'],
    recommended: true,
  },
  {
    id: 3,
    name: 'Giga Fiber',
    speed: '1 Gbps',
    price: '199',
    features: ['Unlimited Data', '24/7 Support', 'Premium Wi-Fi 6E', 'Static IP'],
  },
];

function App() {
  const [successMessage, setSuccessMessage] = useState('');

  const handleLeadSubmit = (data) => {
    console.log('Lead captured:', data);
    setSuccessMessage('Thank you! We will contact you soon.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInstallSubmit = (data) => {
    console.log('Installation request:', data);
    setSuccessMessage('Request received! An agent will call you to schedule.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      {successMessage && (
        <div className="toast glass">
          <p>{successMessage}</p>
          <button onClick={() => setSuccessMessage('')}>×</button>
        </div>
      )}

      <nav className="glass">
        <div className="nav-content">
          <div className="logo">Nexus Fiber</div>
          <div className="nav-links">
            <a href="#plans">Plans</a>
            <a href="#install">Request Installation</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Fastest Fiber in the Cosmos</h1>
          <p>Experience ultra-low latency and symmetrical speeds that propel your digital life to new heights.</p>
          <div className="lead-section">
            <LeadForm onSubmit={handleLeadSubmit} />
          </div>
        </div>
      </section>

      <section id="plans">
        <PlansList plans={MOCK_PLANS} />
      </section>

      <section id="install">
        <InstallationForm onSubmit={handleInstallSubmit} />
      </section>

      <footer className="glass">
        <p>&copy; 2026 Nexus Fiber. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

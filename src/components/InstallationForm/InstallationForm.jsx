import React, { useState } from 'react';
import './InstallationForm.css';

function InstallationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    plan: 'Essential Fiber'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    if (onSubmit) onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="installation-container">
      <form className="installation-form glass" onSubmit={handleSubmit}>
        <h2>Request Installation</h2>
        <div className="form-group">
          <label htmlFor="install-name">Full Name</label>
          <input
            id="install-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="install-address">Complete Address</label>
          <input
            id="install-address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, Number, Neighborhood"
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="install-phone">Phone Number</label>
          <input
            id="install-phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="install-plan">Select Plan</label>
          <select
            id="install-plan"
            name="plan"
            value={formData.plan}
            onChange={handleChange}
          >
            <option value="Essential Fiber">Essential Fiber (300 Mbps)</option>
            <option value="Advanced Fiber">Advanced Fiber (600 Mbps)</option>
            <option value="Giga Fiber">Giga Fiber (1 Gbps)</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default InstallationForm;

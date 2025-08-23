import React, { useEffect } from "react";

const availableCurrencies = [
  { code: "INR", symbol: "₹", label: "INR (₹)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  // Add more if needed
];

const Settings = ({ selectedCurrency, setSelectedCurrency }) => {
  // On mount, use saved currency if available
  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved && availableCurrencies.find((c) => c.code === saved)) {
      setSelectedCurrency(saved);
    }
  }, [setSelectedCurrency]);

  const handleChange = (e) => {
    setSelectedCurrency(e.target.value);
    localStorage.setItem("currency", e.target.value);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="form-group">
        <label>Select Currency:</label>
        <select value={selectedCurrency} onChange={handleChange}>
          {availableCurrencies.map((cur) => (
            <option key={cur.code} value={cur.code}>
              {cur.label}
            </option>
          ))}
        </select>
      </div>
      <p style={{marginTop:"1rem"}}>Selected: <strong>{selectedCurrency}</strong></p>
      {/* Add other settings here later */}
    </div>
  );
};

export default Settings;

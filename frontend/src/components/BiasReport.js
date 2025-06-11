// frontend/src/components/BiasReport.js

import React, { useState } from 'react';
import axios from 'axios';

const BiasReport = () => {
  const [result, setResult] = useState(null);

  const sampleData = [
    { label: 1, prediction: 1, gender: 'male' },
    { label: 1, prediction: 0, gender: 'female' },
    { label: 0, prediction: 0, gender: 'female' },
    { label: 1, prediction: 1, gender: 'male' },
    { label: 1, prediction: 0, gender: 'female' },
  ];

  const handleEvaluate = async () => {
    try {
      const res = await axios.post("http://localhost:5000/evaluate_bias", {
        data: sampleData,
      });
      setResult(res.data);
    } catch (err) {
      console.error("Bias evaluation failed", err);
    }
  };

  return (
    <div>
      <h2>Bias Evaluation Report</h2>
      <button onClick={handleEvaluate}>Evaluate Bias</button>
      {result && (
        <div>
          <p>Demographic Parity Difference: {result.demographic_parity_difference.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
};

export default BiasReport;

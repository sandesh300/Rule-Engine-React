import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CombineRule = () => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/rules/getRules');
      setRules(response.data);
    } catch (error) {
      toast.error('Failed to fetch rules: ' + error.message);
    }
  };

  const handleCombine = async () => {
    if (selectedRules.length < 2) {
      toast.warning('Please select at least 2 rules to combine');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/rules/combine', selectedRules);
      toast.success('Rules combined successfully!');
      setSelectedRules([]);
    } catch (error) {
      toast.error('Failed to combine rules: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Combine Rules</h2>
      <div className="mb-4">
        {rules.map(rule => (
          <div key={rule.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedRules.includes(rule.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRules([...selectedRules, rule.id]);
                } else {
                  setSelectedRules(selectedRules.filter(id => id !== rule.id));
                }
              }}
              className="mr-2"
            />
            <span>{rule.ruleName}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleCombine}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Combine Selected Rules
      </button>
    </div>
  );
};

export default CombineRule;

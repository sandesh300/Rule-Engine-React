import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EvaluateRule = () => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState('');
  const [userData, setUserData] = useState('');
  const [result, setResult] = useState(null);

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

  const handleEvaluate = async () => {
    try {
      const userDataObj = JSON.parse(userData);
      const response = await axios.post(
        `http://localhost:8080/api/rules/evaluate?ruleId=${selectedRule}`,
        userDataObj
      );
      setResult(response.data);
      toast.success('Rule evaluated successfully!');
    } catch (error) {
      toast.error('Failed to evaluate rule: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Evaluate Rule</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Rule</label>
        <select
          value={selectedRule}
          onChange={(e) => setSelectedRule(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a rule</option>
          {rules.map(rule => (
            <option key={rule.id} value={rule.id}>{rule.ruleName}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">User Data (JSON)</label>
        <textarea
          value={userData}
          onChange={(e) => setUserData(e.target.value)}
          className="w-full p-2 border rounded h-32"
          placeholder='{"age": 35, "salary": 60000}'
        />
      </div>
      <button
        onClick={handleEvaluate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Evaluate Rule
      </button>
      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <p>{result ? 'Rule conditions met' : 'Rule conditions not met'}</p>
        </div>
      )}
    </div>
  );
};

export default EvaluateRule;

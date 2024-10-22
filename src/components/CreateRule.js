import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateRule = () => {
  const [ruleName, setRuleName] = useState('');
  const [ruleString, setRuleString] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/rules/create', {
        ruleName,
        ruleString
      });
      toast.success('Rule created successfully!');
      setRuleName('');
      setRuleString('');
    } catch (error) {
      toast.error('Failed to create rule: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Rule</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rule Name</label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rule Expression</label>
          <textarea
            value={ruleString}
            onChange={(e) => setRuleString(e.target.value)}
            className="w-full p-2 border rounded h-32"
            placeholder="Example: age > 30 AND salary > 50000"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Rule
        </button>
      </form>
    </div>
  );
};

export default CreateRule;
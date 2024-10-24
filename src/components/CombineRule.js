import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const CombineRulesPage = () => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCombining, setIsCombining] = useState(false);
  const [error, setError] = useState('');
  const [combinedRule, setCombinedRule] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/rules/getRules');
      if (!response.ok) {
        throw new Error('Failed to fetch rules');
      }
      const data = await response.json();
      setRules(data.rules);
    } catch (error) {
      toast.error('Failed to fetch rules: ' + error.message);
      setError('Failed to load rules. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRuleSelect = (ruleId) => {
    setSelectedRules((prev) => {
      if (prev.includes(ruleId)) {
        return prev.filter((id) => id !== ruleId);
      }
      return [...prev, ruleId];
    });
    setError('');
    setCombinedRule(null);
  };

  const handleCombineRules = async () => {
    if (selectedRules.length < 2) {
      setError('Please select at least two rules to combine');
      return;
    }

    setIsCombining(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/rules/combine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedRules),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to combine rules');
      }

      setCombinedRule(data.combinedRule);
      toast.success('Rules combined successfully!', {
        icon: <CheckCircle2 className="text-green-500" />,
      });
    } catch (error) {
      toast.error(error.message, {
        icon: <AlertCircle className="text-red-500" />,
      });
      setError('Failed to combine rules. Please try again.');
    } finally {
      setIsCombining(false);
    }
  };

  const renderRuleCard = (rule) => {
    const isSelected = selectedRules.includes(rule.id);

    return (
      <div
        key={rule.id}
        className={`border rounded-lg p-4 cursor-pointer transition-all
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
        onClick={() => handleRuleSelect(rule.id)}
      >
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleRuleSelect(rule.id)}
            className="h-4 w-4 text-blue-600"
          />
          <div className="flex-1">
            <h3 className="font-medium">{rule.ruleName}</h3>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-medium">Combine Rules</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-4 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Available Rules</h2>
          <div className="space-y-3">
            {rules.length === 0 ? (
              <p className="text-gray-500">No rules available. Create some rules first.</p>
            ) : (
              rules.map((rule) => renderRuleCard(rule))
            )}
          </div>
        </div>

        <button
          onClick={handleCombineRules}
          disabled={selectedRules.length < 2 || isCombining}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${selectedRules.length < 2 || isCombining
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isCombining ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Combining Rules...
            </span>
          ) : (
            'Combine Selected Rules'
          )}
        </button>

        {combinedRule && (
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Combined Rule</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Combined Rule Structure:</h3>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(combinedRule, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombineRulesPage;
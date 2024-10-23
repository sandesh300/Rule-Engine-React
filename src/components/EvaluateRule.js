import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';

const EvaluateRulePage = () => {
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [userData, setUserData] = useState({
    age: '',
    department: '',
    salary: '',
    experience: ''
  });
  const [showRuleDropdown, setShowRuleDropdown] = useState(false);

  const departments = ['Sales', 'Marketing', 'IT', 'HR'];

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

  const validateUserData = () => {
    const errors = [];
    
    if (!userData.age || isNaN(userData.age)) {
      errors.push('Age must be a valid number');
    }
    
    if (!departments.includes(userData.department)) {
      errors.push('Please select a valid department');
    }
    
    if (!userData.salary || isNaN(userData.salary)) {
      errors.push('Salary must be a valid number');
    }
    
    if (!userData.experience || isNaN(userData.experience)) {
      errors.push('Experience must be a valid number');
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setEvaluationResult(null);
  };

  const handleRuleSelect = (ruleId) => {
    setSelectedRuleId(ruleId);
    setShowRuleDropdown(false);
    setError('');
    setEvaluationResult(null);
  };

  const handleEvaluate = async () => {
    if (!selectedRuleId) {
      setError('Please select a rule to evaluate');
      return;
    }

    const validationErrors = validateUserData();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setIsEvaluating(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/rules/evaluate?ruleId=${selectedRuleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: parseInt(userData.age),
          department: userData.department,
          salary: parseInt(userData.salary),
          experience: parseInt(userData.experience)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to evaluate rule');
      }

      setEvaluationResult(data);
      toast.success('Rule evaluated successfully!', {
        icon: <CheckCircle2 className="text-green-500" />,
      });
    } catch (error) {
      toast.error(error.message, {
        icon: <AlertCircle className="text-red-500" />,
      });
      setError('Failed to evaluate rule. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Evaluate Rule</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Rule Selection */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              Select Rule
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRuleDropdown(!showRuleDropdown)}
                className="w-full px-4 py-2 text-left border rounded-md flex items-center justify-between"
              >
                <span>
                  {selectedRuleId 
                    ? rules.find(r => r.id === selectedRuleId)?.ruleName 
                    : 'Select a rule'}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showRuleDropdown ? 'transform rotate-180' : ''}`} />
              </button>
              
              {showRuleDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {rules.map(rule => (
                    <div
                      key={rule.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRuleSelect(rule.id)}
                    >
                      {rule.ruleName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* User Data Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={userData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Department
              </label>
              <select
                name="department"
                value={userData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Salary
              </label>
              <input
                type="number"
                name="salary"
                value={userData.salary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter salary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                value={userData.experience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter years of experience"
              />
            </div>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || !selectedRuleId}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${(isEvaluating || !selectedRuleId)
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isEvaluating ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Evaluating...
              </span>
            ) : (
              'Evaluate Rule'
            )}
          </button>

          {/* Evaluation Result */}
          {evaluationResult && (
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-4">Evaluation Result</h2>
              <div className={`p-4 rounded-md ${
                evaluationResult.result 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    evaluationResult.result ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium">
                    {evaluationResult.message}
                  </span>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Evaluated Data:</h3>
                  <pre className="text-sm bg-white p-3 rounded-md overflow-x-auto">
                    {JSON.stringify(evaluationResult.evaluatedData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluateRulePage;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const CreateRulePage = () => {
  const [formData, setFormData] = useState({
    ruleName: '',
    ruleString: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateRule = (rule) => {
    if (!rule) return false;

    // Check for balanced parentheses
    let balance = 0;
    for (const char of rule) {
      if (char === '(') balance++;
      if (char === ')') balance--;
      if (balance < 0) return false;
    }
    if (balance !== 0) return false;

    // Check for required operators
    if (!rule.includes('AND') && !rule.includes('OR')) return false;

    // Check for comparison operators
    if (!rule.includes('>') && !rule.includes('<') && !rule.includes('=')) return false;

    // Basic attribute validation
    const validAttributes = ['age', 'department', 'salary', 'experience'];
    const hasValidAttribute = validAttributes.some(attr => rule.includes(attr));
    if (!hasValidAttribute) return false;

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validate inputs
    if (!formData.ruleName.trim()) {
      setValidationError('Rule name is required');
      return;
    }

    if (!validateRule(formData.ruleString)) {
      setValidationError('Invalid rule format. Please check the syntax and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/rules/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create rule');
      }

      toast.success('Rule created successfully!', {
        icon: <CheckCircle2 className="text-green-500" />,
      });

      // Reset form
      setFormData({
        ruleName: '',
        ruleString: '',
      });
    } catch (error) {
      toast.error(error.message, {
        icon: <AlertCircle className="text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Rule</h1>
        
        {validationError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-4 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Rule Name
            </label>
            <input
              type="text"
              name="ruleName"
              value={formData.ruleName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter rule name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Rule Expression
            </label>
            <textarea
              name="ruleString"
              value={formData.ruleString}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter rule expression (e.g., (age > 30 AND department = 'Sales') OR (experience > 5))"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Creating Rule...' : 'Create Rule'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRulePage;

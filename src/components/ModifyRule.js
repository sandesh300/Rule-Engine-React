import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Pencil, Trash2, AlertCircle, CheckCircle2, Loader2, X, Save, RotateCcw } from 'lucide-react';

const ModifyRulesPage = () => {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRule, setEditingRule] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editedExpression, setEditedExpression] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Improved AST to string conversion
  const convertASTToString = (node) => {
    if (!node) return '';
    
    // For leaf nodes (operands)
    if (node.type === 'operand') {
      return node.value || '';
    }
    
    // For operator nodes (AND/OR)
    const left = convertASTToString(node.left);
    const right = convertASTToString(node.right);
    
    // Only add parentheses if it's not a leaf node
    if (left && right) {
      return `${left} ${node.value} ${right}`;
    }
    
    return '';
  };

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
      
      // Process the rules to include expression strings
      const processedRules = data.rules.map(rule => {
        const expression = convertASTToString(rule.rootNode);
        return {
          ...rule,
          ruleExpression: expression
        };
      });
      
      setRules(processedRules);
    } catch (error) {
      toast.error('Failed to fetch rules: ' + error.message);
      setError('Failed to load rules. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateRule = (rule) => {
    if (!rule) return false;

    // Rule must include at least one logical operator and one comparison
    if (!rule.includes('AND') && !rule.includes('OR')) return false;
    if (!rule.includes('>') && !rule.includes('<') && !rule.includes('=')) return false;

    // Check for valid attributes
    const validAttributes = ['age', 'department', 'salary', 'experience'];
    const hasValidAttribute = validAttributes.some(attr => rule.includes(attr));
    
    return hasValidAttribute;
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setEditedExpression(rule.ruleExpression);
    setError('');
  };

  const handleUpdate = async () => {
    if (!validateRule(editedExpression)) {
      setError('Invalid rule format. Please check the syntax and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/api/rules/modify?ruleId=${editingRule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: editedExpression,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update rule');
      }

      await fetchRules(); // Refresh the rules list
      setEditingRule(null);
      setEditedExpression('');
      
      toast.success('Rule updated successfully!', {
        icon: <CheckCircle2 className="text-green-500" />
      });
    } catch (error) {
      toast.error(error.message, {
        icon: <AlertCircle className="text-red-500" />
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await fetch(`http://localhost:8080/api/rules/delete?ruleId=${deleteConfirm.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete rule');
      }

      toast.success('Rule deleted successfully!', {
        icon: <CheckCircle2 className="text-green-500" />
      });

      await fetchRules();
    } catch (error) {
      toast.error(error.message, {
        icon: <AlertCircle className="text-red-500" />
      });
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setEditedExpression('');
    setError('');
  };

  const renderRuleCard = (rule) => {
    const isEditing = editingRule?.id === rule.id;

    return (
      <div key={rule.id} className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-lg">{rule.ruleName}</h3>
            
            {isEditing ? (
              <div className="mt-4">
                <textarea
                  value={editedExpression}
                  onChange={(e) => setEditedExpression(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md h-32 font-mono text-sm"
                  placeholder="Enter rule expression"
                />

                {error && (
                  <div className="mt-2 text-red-600">
                    <AlertCircle className="inline-block mr-2" />
                    {error}
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleUpdate}
                    disabled={isSubmitting}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <pre className="mt-4 bg-gray-50 p-3 rounded-md overflow-x-auto text-sm font-mono">
                {rule.ruleExpression}
              </pre>
            )}
          </div>

          {!isEditing && (
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => handleEdit(rule)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit rule"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={() => setDeleteConfirm(rule)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete rule"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
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
      <div className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Modify Rules</h2>
          <button
            onClick={fetchRules}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            title="Refresh rules"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {rules.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No rules available. Create some rules first.
        </p>
      ) : (
        <div className="space-y-4">
          {rules.map(rule => renderRuleCard(rule))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Delete Rule</h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete "{deleteConfirm.ruleName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyRulesPage;
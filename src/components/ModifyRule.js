import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Pencil, Trash2 } from 'lucide-react';

const ModifyRule = () => {
  const [rules, setRules] = useState([]);
  const [editingRule, setEditingRule] = useState(null);
  const [newExpression, setNewExpression] = useState('');

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

  const handleModify = async (ruleId) => {
    try {
      // Create the request body with both ruleString and ruleName
      const requestBody = {
        ruleString: newExpression
      };

      const response = await axios.put(
        `http://localhost:8080/api/rules/modify?ruleId=${ruleId}`, 
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        toast.success('Rule modified successfully!');
        setEditingRule(null);
        setNewExpression('');
        fetchRules();
      }
    } catch (error) {
      toast.error('Failed to modify rule: ' + (error.response?.data || error.message));
    }
  };

  const handleDelete = async (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await axios.delete(`http://localhost:8080/api/rules/delete?ruleId=${ruleId}`);
        toast.success('Rule deleted successfully!');
        fetchRules();
      } catch (error) {
        toast.error('Failed to delete rule: ' + error.message);
      }
    }
  };

  // Function to build expression string from AST
  const buildExpression = (node) => {
    if (!node) return '';
    
    if (node.type === 'operand') {
      return node.value;
    }
    
    const left = buildExpression(node.left);
    const right = buildExpression(node.right);
    
    // Handle different operator types
    if (node.type === 'operator') {
      return `(${left} ${node.value} ${right})`;
    }
    
    return '';
  };

  const handleEditClick = (rule) => {
    setEditingRule(rule.id);
    const currentExpression = buildExpression(rule.rootNode);
    setNewExpression(currentExpression || '');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Modify Rules</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Rule Name</th>
              <th className="px-4 py-2 text-left">Expression</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <React.Fragment key={rule.id}>
                <tr className="border-b">
                  <td className="px-4 py-2">{rule.ruleName}</td>
                  <td className="px-4 py-2">
                    {rule.rootNode && (
                      <div className="max-w-md overflow-hidden overflow-ellipsis">
                        {buildExpression(rule.rootNode)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleEditClick(rule)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Edit Rule"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Rule"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
                {editingRule === rule.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="3" className="px-4 py-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Edit Rule Expression
                          </label>
                          <textarea
                            value={newExpression}
                            onChange={(e) => setNewExpression(e.target.value)}
                            className="w-full p-2 border rounded mb-2 min-h-[100px]"
                            placeholder="Enter new rule expression (e.g., age > 30 AND salary > 50000)"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingRule(null);
                              setNewExpression('');
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleModify(rule.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModifyRule;
import axios from 'axios';

// Set up Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api/rules',  // Your Spring Boot backend URL
});

// API call to create a rule
export const createRule = (ruleString, ruleName) => {
  return api.post('/create', null, {
    params: { ruleName },
    data: ruleString
  });
};

// API call to evaluate a rule
export const evaluateRule = (userData, ruleId) => {
  return api.post('/evaluate', userData, {
    params: { ruleId }
  });
};

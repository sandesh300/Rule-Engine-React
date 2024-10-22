// Allowed attributes catalog
const VALID_ATTRIBUTES = ['age', 'income', 'yearsOfExperience', 'gender'];

// Allowed operators
const VALID_OPERATORS = ['>', '<', '='];

// Main function to validate form before submission
function validateForm() {
    const ruleName = document.getElementById('ruleName').value.trim();
    const ruleString = document.getElementById('ruleString').value.trim();
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';  // Clear previous error messages

    // Check if the rule name is provided
    if (!ruleName) {
        errorMessage.textContent = 'Rule name is required.';
        return false;
    }

    // Check if the rule expression is provided
    if (!ruleString) {
        errorMessage.textContent = 'Rule expression is required.';
        return false;
    }

    // Validate the rule string format
    if (!isValidRuleString(ruleString)) {
        errorMessage.textContent = 'Invalid rule expression format.';
        return false;
    }

    return true; // Submit the form if all validations pass
}

// Function to validate the rule string format
function isValidRuleString(ruleString) {
    // Split the rule string on AND/OR operators
    const parts = ruleString.split(/\sAND\s|\sOR\s/);

    for (let part of parts) {
        part = part.trim();
        if (!isValidCondition(part)) {
            return false; // If any part is invalid, return false
        }
    }

    return true;
}

// Function to validate each condition in the rule string (e.g., "age > 30")
function isValidCondition(condition) {
    const regex = /^([a-zA-Z]+)\s([><=])\s(\d+)$/;
    const match = condition.match(regex);

    if (!match) {
        return false;
    }

    const attribute = match[1];
    const operator = match[2];
    const value = match[3];

    // Validate attribute, operator, and value
    return isValidAttribute(attribute) && isValidOperator(operator) && isValidValue(value);
}

// Check if the attribute is valid
function isValidAttribute(attribute) {
    return VALID_ATTRIBUTES.includes(attribute);
}

// Check if the operator is valid
function isValidOperator(operator) {
    return VALID_OPERATORS.includes(operator);
}

// Check if the value is a valid number
function isValidValue(value) {
    return !isNaN(value) && Number.isInteger(parseFloat(value));
}

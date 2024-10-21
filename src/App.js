// src/App.js
import React from 'react';
import CreateRule from './pages/CreateRule';
import ListRules from './pages/ListRules';
import CombineRules from './pages/CombineRules';
import EvaluateRule from './pages/EvaluateRule';
import ModifyRule from './pages/ModifyRule';
import './index.css'; // Add your custom styles

function App() {
    return (
        <div className="App">
            <h1>Rule Engine</h1>
            <CreateRule />
            <ListRules />
            <CombineRules />
            <EvaluateRule />
            <ModifyRule />
        </div>
    );
}

export default App;

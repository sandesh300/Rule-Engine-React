import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import CreateRule from './components/CreateRule';
import CombineRule from './components/CombineRule';
import EvaluateRule from './components/EvaluateRule';
import ModifyRule from './components/ModifyRule';
import Home from './components/Home';

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreateRule />} />
            <Route path="/combine" element={<CombineRule />} />
            <Route path="/evaluate" element={<EvaluateRule />} />
            <Route path="/modify" element={<ModifyRule />} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
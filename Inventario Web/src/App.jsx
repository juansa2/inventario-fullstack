// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import InventoryPage from './pages/InventoryPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
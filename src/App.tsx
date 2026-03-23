import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MynaHero } from './components/ui/myna-hero';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MynaHero />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}


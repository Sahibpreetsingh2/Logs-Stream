import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SearchPage from './pages/SearchPage.jsx';
import LiveTailPage from './pages/LiveTailPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/live" element={<LiveTailPage />} />
        </Routes>
      </main>
    </div>
  );
}

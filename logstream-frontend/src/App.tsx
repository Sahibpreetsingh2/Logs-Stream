import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LogExplorer from './pages/LogExplorer';
import Alerts from './pages/Alerts';
import AlertRules from './pages/AlertRules';
import Services from './pages/Services';
import IngestLog from './pages/IngestLog';
import SystemHealth from './pages/SystemHealth';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logs" element={<LogExplorer />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/alert-rules" element={<AlertRules />} />
        <Route path="/services" element={<Services />} />
        <Route path="/ingest" element={<IngestLog />} />
        <Route path="/system-health" element={<SystemHealth />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

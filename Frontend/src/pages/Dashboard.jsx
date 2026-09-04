import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import StatsCards from '../components/dashboard/StatsCards.jsx';
import LogVolumeChart from '../components/dashboard/LogVolumeChart.jsx';
import LogLevelChart from '../components/dashboard/LogLevelChart.jsx';
import TopServicesChart from '../components/dashboard/TopServicesChart.jsx';
import AlertsPanel from '../components/dashboard/AlertsPanel.jsx';

import { getStatistics } from '../api/logService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStatistics() {
      try {
        setLoading(true);
        setError(null);

        const data = await getStatistics();

        if (cancelled) return;

        setStats(data);
      } catch (err) {
        if (cancelled) return;

        console.error('Statistics API error:', err);

        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Could not reach the log backend.'
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStatistics();

    return () => {
      cancelled = true;
    };
  }, []);

  const byLevel = Object.entries(
    stats?.countsByLevel || {}
  ).map(([level, count]) => ({
    level,
    count,
  }));

  return (
    <div>
      <Navbar
        title="Dashboard"
        subtitle="Overall log statistics across all services"
      />

      <div className="page-body">

        {error && (
          <div className="panel panel-error">
            {error}
          </div>
        )}

        <StatsCards
          stats={stats}
          loading={loading}
        />

        <AlertsPanel
          alerts={[]}
          loading={false}
          error={null}
        />

        <LogVolumeChart
          data={[]}
          loading={false}
        />

        <div className="charts-row">

          <LogLevelChart
            data={byLevel}
            loading={loading}
          />

          <TopServicesChart
            data={[]}
            loading={false}
          />

        </div>

      </div>
    </div>
  );
}
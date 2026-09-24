import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { TimelineBucket } from '../../types/Statistics';
import EmptyState from '../common/EmptyState';
import { LineChart as LineChartIcon } from 'lucide-react';

interface LogChartProps {
  data: TimelineBucket[];
  available: boolean;
}

export default function LogChart({ data, available }: LogChartProps) {
  if (!available) {
    return (
      <EmptyState
        icon={LineChartIcon}
        title="Timeline endpoint not implemented yet"
        description="This chart is wired up to GET /api/logs/statistics/timeline. Once the backend exposes it, historical INFO/WARN/ERROR volume will render here automatically."
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={LineChartIcon}
        title="No historical data yet"
        description="Once logs accumulate, volume over time will appear here."
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="fillInfo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3ea6ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3ea6ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillWarn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#e8a53d" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#e8a53d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillError" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f0555a" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f0555a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#232c37" vertical={false} />
        <XAxis
          dataKey="timestamp"
          stroke="#5f6c7a"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#5f6c7a" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: '#151b23',
            border: '1px solid #232c37',
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: '#9aa7b5' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="info" name="INFO" stroke="#3ea6ff" fill="url(#fillInfo)" strokeWidth={2} />
        <Area type="monotone" dataKey="warn" name="WARN" stroke="#e8a53d" fill="url(#fillWarn)" strokeWidth={2} />
        <Area type="monotone" dataKey="error" name="ERROR" stroke="#f0555a" fill="url(#fillError)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

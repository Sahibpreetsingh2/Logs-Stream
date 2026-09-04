import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

// data: [{ serviceName, count, errorCount }]
export default function TopServicesChart({ data = [], loading }) {
  const sorted = useMemo(() => [...data].sort((a, b) => a.count - b.count).slice(-8), [data]);

  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      textStyle: { color: '#AAB3C8', fontFamily: 'Inter, sans-serif' },
      grid: { left: 120, right: 20, top: 10, bottom: 20 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: '#1A2030', borderColor: '#242C40', textStyle: { color: '#E7EAF2' } },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#1A2030' } },
        axisLabel: { color: '#6C7591' },
      },
      yAxis: {
        type: 'category',
        data: sorted.map((d) => d.serviceName),
        axisLine: { lineStyle: { color: '#242C40' } },
        axisLabel: { color: '#AAB3C8' },
      },
      series: [
        {
          name: 'Log count',
          type: 'bar',
          barMaxWidth: 16,
          itemStyle: { color: '#7C6CF0', borderRadius: [0, 4, 4, 0] },
          data: sorted.map((d) => d.count),
        },
      ],
    }),
    [sorted]
  );

  return (
    <div className="panel panel-padded">
      <p className="panel-title">Top Services by Volume</p>
      {loading ? (
        <div className="chart-loading">Loading…</div>
      ) : (
        <ReactECharts option={option} style={{ height: 288 }} notMerge lazyUpdate />
      )}
    </div>
  );
}

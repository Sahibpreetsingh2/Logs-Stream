import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

// data: [{ bucket: '2026-08-19T10:00:00', info, warn, error }]
export default function LogVolumeChart({ data = [], loading }) {
  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      textStyle: { color: '#AAB3C8', fontFamily: 'Inter, sans-serif' },
      grid: { left: 40, right: 20, top: 30, bottom: 30 },
      tooltip: { trigger: 'axis', backgroundColor: '#1A2030', borderColor: '#242C40', textStyle: { color: '#E7EAF2' } },
      legend: {
        data: ['Info', 'Warn', 'Error'],
        top: 0,
        textStyle: { color: '#AAB3C8' },
        icon: 'circle',
      },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.bucket),
        axisLine: { lineStyle: { color: '#242C40' } },
        axisLabel: { color: '#6C7591' },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#1A2030' } },
        axisLabel: { color: '#6C7591' },
      },
      series: [
        {
          name: 'Info',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'total',
          areaStyle: { opacity: 0.15 },
          lineStyle: { width: 2 },
          itemStyle: { color: '#4FA6E8' },
          data: data.map((d) => d.info),
        },
        {
          name: 'Warn',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'total',
          areaStyle: { opacity: 0.15 },
          lineStyle: { width: 2 },
          itemStyle: { color: '#E8B44F' },
          data: data.map((d) => d.warn),
        },
        {
          name: 'Error',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'total',
          areaStyle: { opacity: 0.2 },
          lineStyle: { width: 2 },
          itemStyle: { color: '#E85C5C' },
          data: data.map((d) => d.error),
        },
      ],
    }),
    [data]
  );

  return (
    <div className="panel panel-padded">
      <p className="panel-title">Log Volume Over Time</p>
      {loading ? (
        <div className="chart-loading">Loading…</div>
      ) : (
        <ReactECharts option={option} style={{ height: 288 }} notMerge lazyUpdate />
      )}
    </div>
  );
}

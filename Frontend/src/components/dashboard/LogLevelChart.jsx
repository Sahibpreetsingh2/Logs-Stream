import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

const COLORS = {
  INFO: '#4FA6E8',
  WARN: '#E8B44F',
  ERROR: '#E85C5C',
};

// data: [{ level: 'INFO', count: 1234 }, ...]
export default function LogLevelChart({ data = [], loading }) {
  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',

      textStyle: {
        color: '#AAB3C8',
        fontFamily: 'Inter, sans-serif',
      },

      tooltip: {
        trigger: 'item',
        backgroundColor: '#1A2030',
        borderColor: '#242C40',
        textStyle: {
          color: '#E7EAF2',
        },
      },

      legend: {
        bottom: 0,
        textStyle: {
          color: '#AAB3C8',
        },
        icon: 'circle',
      },

      series: [
        {
          type: 'pie',
          radius: ['55%', '75%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,

          itemStyle: {
            borderColor: '#111621',
            borderWidth: 2,
          },

          label: {
            show: false,
          },

          labelLine: {
            show: false,
          },

          data: data.map((d) => ({
            name: d.level,
            value: d.count,
            itemStyle: {
              color: COLORS[d.level] || '#7B8499',
            },
          })),
        },
      ],
    }),
    [data]
  );

  return (
    <div className="panel panel-padded">
      <p className="panel-title">Level Breakdown</p>

      {loading ? (
        <div className="chart-loading">
          Loading…
        </div>
      ) : (
        <ReactECharts
          option={option}
          style={{ height: 288 }}
          notMerge
          lazyUpdate
        />
      )}
    </div>
  );
}

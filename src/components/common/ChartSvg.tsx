import React from 'react';

interface LineChartPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface AreaLineChartProps {
  data: LineChartPoint[];
  height?: number;
  valueSuffix?: string;
  lineColor?: string;
  areaColor?: string;
  title?: string;
  secondaryLabel?: string;
}

export const AreaLineChart: React.FC<AreaLineChartProps> = ({
  data,
  height = 200,
  valueSuffix = 'kW',
  lineColor = '#2563eb',
  areaColor = 'rgba(37, 99, 235, 0.1)',
  title,
}) => {
  if (!data || data.length === 0) return null;

  const width = 600;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const minVal = Math.max(0, Math.floor(Math.min(...values) * 0.8));
  const maxVal = Math.ceil(Math.max(...values) * 1.2) || 20;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) =>
    paddingTop + chartHeight - ((val - minVal) / (maxVal - minVal || 1)) * chartHeight;

  // Build SVG path
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${getX(data.length - 1)},${paddingTop + chartHeight} L ${getX(0)},${paddingTop + chartHeight} Z`;

  return (
    <div className="w-full">
      {title && (
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          {title}
        </div>
      )}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          style={{ minWidth: '380px' }}
        >
          <defs>
            <linearGradient id={`grad-${lineColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (3 horizontal levels) */}
          {[0, 0.5, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * ratio;
            const labelVal = Math.round(maxVal - ratio * (maxVal - minVal));
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  {labelVal} {valueSuffix}
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          <path d={areaD} fill={`url(#grad-${lineColor.replace('#', '')})`} />

          {/* Primary Trend Line */}
          <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" />

          {/* Data points & labels */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.value);
            return (
              <g key={i} className="group">
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#ffffff"
                  stroke={lineColor}
                  strokeWidth="2.5"
                  className="transition-transform group-hover:scale-125 cursor-pointer"
                />
                <text
                  x={x}
                  y={paddingTop + chartHeight + 18}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="11"
                  fontWeight="500"
                >
                  {d.label}
                </text>
                {/* Tooltip value */}
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {d.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

interface BarChartItem {
  label: string;
  value: number;
  color?: string;
  secondaryText?: string;
}

interface HorizontalBarChartProps {
  data: BarChartItem[];
  maxValue?: number;
  valueSuffix?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  maxValue,
  valueSuffix = 'kW',
}) => {
  const calculatedMax = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3 w-full">
      {data.map((item, idx) => {
        const pct = Math.min(100, Math.round((item.value / calculatedMax) * 100));
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span className="truncate pr-2">{item.label}</span>
              <span className="font-semibold text-slate-900 shrink-0">
                {item.value} {valueSuffix} {item.secondaryText && `(${item.secondaryText})`}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.color || 'bg-blue-600'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

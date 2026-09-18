import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  iconBgColor?: string;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
  accentBorderColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  badge,
  badgeColor = 'bg-slate-100 text-slate-700',
  onClick,
  accentBorderColor,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`group relative bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5'
          : ''
      } ${accentBorderColor ? `border-t-4 ${accentBorderColor}` : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {title}
            </span>
            {badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium pt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            className={`w-11 h-11 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
          >
            <Icon className="w-5 h-5" />
          </div>
          {onClick && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 group-hover:text-blue-600 flex items-center text-[11px] font-semibold gap-0.5">
              <span>View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

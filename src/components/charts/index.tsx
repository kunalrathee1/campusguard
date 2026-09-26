import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const COLORS = {
  indigo: '#6366f1',
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  slate: '#94a3b8',
};

const tooltipStyle = {
  contentStyle: { border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  labelStyle: { fontWeight: 600, marginBottom: 4 },
};

// ─── ATTENDANCE TREND CHART ───────────────────────────────────────────────────
interface AttendanceTrendProps {
  data: { week: string; percentage: number; present?: number; absent?: number }[];
  height?: number;
}
export function AttendanceTrendChart({ data, height = 240 }: AttendanceTrendProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
        <defs>
          <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.15} />
            <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, 'Attendance']} />
        <Area type="monotone" dataKey="percentage" stroke={COLORS.indigo} strokeWidth={2.5} fill="url(#attGrad)" dot={{ fill: COLORS.indigo, r: 3 }} activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── RISK DISTRIBUTION PIE ───────────────────────────────────────────────────
interface RiskDistProps {
  low: number;
  medium: number;
  high: number;
  height?: number;
}
export function RiskDistributionChart({ low, medium, high, height = 220 }: RiskDistProps) {
  const data = [
    { name: 'Low Risk', value: low, color: COLORS.emerald },
    { name: 'Medium Risk', value: medium, color: COLORS.amber },
    { name: 'High Risk', value: high, color: COLORS.red },
  ].filter(d => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v: number) => [v, 'Students']} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── DEPARTMENT ATTENDANCE BAR ───────────────────────────────────────────────
interface DeptBarProps {
  data: { name: string; attendance: number }[];
  height?: number;
}
export function DepartmentAttendanceChart({ data, height = 220 }: DeptBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, 'Avg Attendance']} />
        <Bar dataKey="attendance" fill={COLORS.indigo} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── WARNING TREND ─────────────────────────────────────────────────────────
interface WarningTrendProps {
  data: { month: string; open: number; acknowledged: number; resolved: number }[];
  height?: number;
}
export function WarningTrendChart({ data, height = 220 }: WarningTrendProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>} />
        <Bar dataKey="open" name="Open" fill={COLORS.red} radius={[4, 4, 0, 0]} stackId="a" />
        <Bar dataKey="acknowledged" name="Acknowledged" fill={COLORS.amber} radius={[0, 0, 0, 0]} stackId="a" />
        <Bar dataKey="resolved" name="Resolved" fill={COLORS.emerald} radius={[0, 0, 0, 0]} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── SUBJECT ATTENDANCE BAR ────────────────────────────────────────────────
interface SubjectBarProps {
  data: { subject: string; percentage: number }[];
  height?: number;
}
export function SubjectAttendanceChart({ data, height = 220 }: SubjectBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={130} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, 'Attendance']} />
        <Bar dataKey="percentage" radius={[0, 6, 6, 0]} fill={COLORS.indigo}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.percentage >= 75 ? COLORS.emerald : entry.percentage >= 65 ? COLORS.amber : COLORS.red} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── WEEKLY ATTENDANCE LINE ────────────────────────────────────────────────
interface WeeklyLineProps {
  data: { week: string; present: number; absent: number; late: number; percentage: number }[];
  height?: number;
}
export function WeeklyAttendanceChart({ data, height = 240 }: WeeklyLineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>} />
        <Line type="monotone" dataKey="present" name="Present" stroke={COLORS.emerald} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="absent" name="Absent" stroke={COLORS.red} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="late" name="Late" stroke={COLORS.amber} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}

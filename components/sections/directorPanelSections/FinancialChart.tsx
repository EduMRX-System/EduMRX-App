"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Backenddan kelishi kerak bo'lgan data formati (quyida tushuntirilgan)
const data = [
    { name: 'Yan', c1: 48, c2: 38, c3: 28, c4: 18, c5: 22 },
    { name: 'Fev', c1: 52, c2: 42, c3: 32, c4: 21, c5: 25 },
    { name: 'Mar', c1: 60, c2: 48, c3: 38, c4: 28, c5: 31 },
    { name: 'Apr', c1: 58, c2: 52, c3: 42, c4: 31, c5: 28 },
    { name: 'May', c1: 72, c2: 58, c3: 48, c4: 38, c5: 35 },
    { name: 'Iyun', c1: 78, c2: 63, c3: 52, c4: 42, c5: 39 },
    { name: 'Iyul', c1: 85, c2: 68, c3: 56, c4: 45, c5: 43 },
    { name: 'Avg', c1: 82, c2: 72, c3: 59, c4: 48, c5: 46 },
    { name: 'Sen', c1: 90, c2: 78, c3: 63, c4: 52, c5: 49 },
    { name: 'Okt', c1: 95, c2: 82, c3: 68, c4: 55, c5: 53 },
    { name: 'Noy', c1: 102, c2: 88, c3: 73, c4: 58, c5: 56 },
    { name: 'Dek', c1: 108, c2: 92, c3: 78, c4: 62, c5: 58 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    const { t } = useTranslation();
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface/95 /95 backdrop-blur-md border border-border p-4 rounded-xl shadow-xl transition-colors">
                <p className="text-xs font-bold text-foreground-muted mb-3 uppercase tracking-wider">{label}</p>
                <div className="space-y-2">
                    {payload.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                                <span className="text-sm font-medium text-foreground">{t("director.dashboard.chart.center", { num: 5 - index })}</span>
                            </div>
                            <span className="text-sm font-bold text-foreground">{item.value}M UZS</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function FinancialTrendChart() {
    const { t } = useTranslation();

    return (
        <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm transition-colors">

            {/* ── HEADER QISMI ── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-lg font-bold text-foreground mb-1 transition-colors">{t("director.dashboard.chart.title")}</h2>
                    <p className="text-sm font-medium text-foreground-subtle">{t("director.dashboard.chart.desc")}</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-primary-soft px-4 py-2 rounded-xl border border-primary/20 transition-colors">
                        <span className="text-xs font-semibold text-primary mr-1.5">{t("director.dashboard.chart.total")}</span>
                        <span className="text-sm font-bold text-primary">3324M UZS</span>
                    </div>

                    <button className="flex items-center gap-2 bg-slate-50 /50 border border-border px-3 py-2 rounded-xl text-foreground-muted hover:bg-hover transition-colors cursor-pointer">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">{t("director.dashboard.chart.months_12")}</span>
                        <ChevronDown className="w-4 h-4 text-foreground-subtle" />
                    </button>
                </div>
            </div>

            {/* ── CHART QISMI ── */}
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorC1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorC2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorC3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorC4" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorC5" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                            tickFormatter={(val) => `${val}M`}
                            domain={[0, 120]}
                            ticks={[0, 30, 60, 90, 120]}
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />

                        <Area type="monotone" dataKey="c1" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorC1)" />
                        <Area type="monotone" dataKey="c2" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorC2)" />
                        <Area type="monotone" dataKey="c3" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorC3)" />
                        <Area type="monotone" dataKey="c4" stroke="#ec4899" strokeWidth={2.5} fillOpacity={1} fill="url(#colorC4)" />
                        <Area type="monotone" dataKey="c5" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorC5)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

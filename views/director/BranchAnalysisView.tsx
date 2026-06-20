"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Building2, Plus, UserPlus, UserMinus, TrendingUp, Wallet,
  ChevronDown, RefreshCw, ArrowRight, Download
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Title from '@/components/ui/Title';
import Text from '@/components/ui/Text';

// PULLARNI FORMATLASH UCHUN HELPER
const formatUZS = (amount: number) => {
  if (!amount) return "0";
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} mlrd`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} mln`;
  return amount.toLocaleString("uz-UZ");
};

export default function BranchAnalyticsView() {
  const router = useRouter();
  const { t } = useTranslation();

  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedBranchId, setSelectedBranchId] = useState<number | string>("");

  // TAYYOR MOCK DATA (API Ulanmaguncha)
  const mockBranches = [
    { id: 1, name: "Chilonzor IT Akademiyasi" },
    { id: 2, name: "Yunusobod Hub" }
  ];
  const mockAnalyticsData = [
    { month: 'Yan', kelgan: 45, ketgan: 12, tolov: 45000000 },
    { month: 'Fev', kelgan: 52, ketgan: 18, tolov: 58000000 },
    { month: 'Mar', kelgan: 68, ketgan: 15, tolov: 72000000 },
    { month: 'Apr', kelgan: 58, ketgan: 22, tolov: 64000000 },
    { month: 'May', kelgan: 85, ketgan: 25, tolov: 91000000 },
    { month: 'Iyun', kelgan: 92, ketgan: 30, tolov: 105000000 },
    { month: 'Iyul', kelgan: 74, ketgan: 35, tolov: 98000000 },
  ];

  // 1. FILIALLARNI YUKLASH
  const { data: branches = mockBranches, isLoading: branchesLoading } = useQuery({
    queryKey: ['analytics', 'branches'],
    queryFn: async () => mockBranches, // API call qilinadi
    staleTime: 60000,
  });

  // 2. ANALITIKANI YUKLASH
  const { data: analytics = mockAnalyticsData, isLoading: analyticsLoading, refetch } = useQuery({
    queryKey: ['analytics', 'data', selectedBranchId, selectedYear],
    queryFn: async () => mockAnalyticsData, // API call qilinadi
    enabled: !!selectedBranchId,
  });

  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches, selectedBranchId]);

  // HISOB-KITOBLAR
  const totalKelgan = analytics.reduce((sum, item) => sum + item.kelgan, 0);
  const totalKetgan = analytics.reduce((sum, item) => sum + item.ketgan, 0);
  const netGrowth = totalKelgan - totalKetgan;
  const totalTolov = analytics.reduce((sum, item) => sum + item.tolov, 0);

  // ── SKELETON LOADER ──
  if (branchesLoading || analyticsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-full w-full max-w-md"></div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  // ── EMPTY STATE (Filiallar yo'q bo'lsa) ──
  if (!branchesLoading && branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50/30 dark:bg-[#0F1525] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 mb-5 animate-bounce">
          <Building2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{t('director.analytics.empty.title')}</h2>
        <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">{t('director.analytics.empty.desc')}</p>
        <button onClick={() => router.push('/branches')} className="inline-flex items-center gap-2 text-sm font-bold bg-[#5B4DF6] hover:bg-[#4a3ecc] text-white px-5 py-3 rounded-xl cursor-pointer group transition-colors">
          <Plus className="w-4 h-4" />
          <span>{t('director.analytics.empty.add_btn')}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* ── HEADER BLOCK ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <Title text={t('director.analytics.title')} />
          <Text text={t('director.analytics.title')} />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('director.analytics.export')}</span>
          </button>

          <div className="relative inline-block text-left">
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="appearance-none bg-white dark:bg-[#1A2035] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 pl-4 pr-9 py-2.5 rounded-xl outline-none cursor-pointer">
              <option value="2026">{t('director.analytics.years.2026')}</option>
              <option value="2025">{t('director.analytics.years.2025')}</option>
              <option value="2024">{t('director.analytics.years.2024')}</option>
              <option value="2023">{t('director.analytics.years.2023')}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button onClick={() => refetch()} className="p-2.5 bg-white dark:bg-[#1A2035] border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── FILIAL SELECTION (RASMDAGI DIZAYN) ── */}
      <div className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-[#0F1525] border border-slate-200 dark:border-slate-800/60 rounded-full overflow-x-auto custom-scrollbar">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => setSelectedBranchId(branch.id)}
            className={`px-5 py-2.5 text-sm font-bold rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${selectedBranchId === branch.id
              ? 'bg-[#5B4DF6] text-white shadow-md' // Rasmdagi binafsha rang
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50'
              }`}
          >
            {branch.name}
          </button>
        ))}
      </div>

      {/* ── CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-[#1A2035] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center mb-3"><UserPlus className="w-5 h-5" /></div>
          <p className="text-[11px] font-bold text-slate-400 uppercase">{t('director.analytics.cards.incoming')}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">+{totalKelgan}</h3>
        </div>
        <div className="bg-white dark:bg-[#1A2035] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 flex items-center justify-center mb-3"><UserMinus className="w-5 h-5" /></div>
          <p className="text-[11px] font-bold text-slate-400 uppercase">{t('director.analytics.cards.outgoing')}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">-{totalKetgan}</h3>
        </div>
        <div className="bg-white dark:bg-[#1A2035] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center mb-3"><TrendingUp className="w-5 h-5" /></div>
          <p className="text-[11px] font-bold text-slate-400 uppercase">{t('director.analytics.cards.net_growth')}</p>
          <h3 className={`text-2xl font-black mt-0.5 ${netGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{netGrowth >= 0 ? `+${netGrowth}` : netGrowth}</h3>
        </div>
        <div className="bg-white dark:bg-[#1A2035] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 flex items-center justify-center mb-3"><Wallet className="w-5 h-5" /></div>
          <p className="text-[11px] font-bold text-slate-400 uppercase">{t('director.analytics.cards.total_revenue')}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{formatUZS(totalTolov)}</h3>
        </div>
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BAR CHART */}
        <div className="bg-white dark:bg-[#1A2035] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs">
          <div className="mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('director.analytics.charts.flow_title')}</h3>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
                <Tooltip cursor={{ fill: '#334155', opacity: 0.2 }} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Bar name={t('director.analytics.charts.legend_in')} dataKey="kelgan" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar name={t('director.analytics.charts.legend_out')} dataKey="ketgan" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AREA CHART */}
        <div className="bg-white dark:bg-[#1A2035] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs">
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('director.analytics.charts.revenue_title')}</h3>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTolov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B4DF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5B4DF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#fff' }} formatter={(value: any) => [`${value.toLocaleString()} UZS`, "Tushum"]} />
                <Area type="monotone" dataKey="tolov" stroke="#5B4DF6" strokeWidth={3} fillOpacity={1} fill="url(#colorTolov)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
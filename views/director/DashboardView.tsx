"use client"

import FinancialChart from '@/components/sections/directorPanelSections/FinancialChart';
import Text from '@/components/ui/Text';
import Title from '@/components/ui/Title';
import {
  DollarSign, CreditCard, GraduationCap, Wallet,
  ChartColumn, Building, Users, Megaphone,
  PartyPopper, ArrowRight, Calendar,
  Banknote,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

const recentPayments = [
  {
    id: 1,
    studentName: 'Ali Valiyev',
    centerName: 'Chilonzor filiali',
    amount: '500,000 UZS',
    method: 'uzcard',
    time: '2 daqiqa avval'
  },
  {
    id: 2,
    studentName: 'Olim Olimov',
    centerName: 'Yunusobod filiali',
    amount: '1,200,000 UZS',
    method: 'humo',
    time: '15 daqiqa avval'
  },
  {
    id: 3,
    studentName: 'Zarina Karimova',
    centerName: 'Sergeli filiali',
    amount: '750,000 UZS',
    method: 'cash',
    time: '42 daqiqa avval'
  },
  {
    id: 4,
    studentName: 'Madina Axmedova',
    centerName: 'Beruniy filiali',
    amount: '600,000 UZS',
    method: 'uzcard',
    time: '2 soat avval'
  }
];

const getMethodDetails = (method: string) => {
  switch (method) {
    case 'uzcard':
      return {
        icon: <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
        bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50',
        label: 'Uzcard'
      };
    case 'humo':
      return {
        icon: <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
        label: 'Humo'
      };
    default:
      return {
        icon: <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
        bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50',
        label: 'Naqd'
      };
  }
};

const DirectorDashboard = () => {
  const stats = [
    { id: 1, title: "To'lovlar", value: "1,240", desc: "Jami to'lovlar soni", icon: <DollarSign size={18} />, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500" },
    { id: 2, title: "To'lov turlari", value: "12", desc: "Mavjud to'lov turlari", icon: <CreditCard size={18} />, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500" },
    { id: 3, title: "O'quvchilar", value: "850", desc: "Jami o'quvchilar", icon: <GraduationCap size={18} />, color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500" },
    { id: 4, title: "Daromad", value: "UZS 155M", desc: "Umumiy daromad", icon: <Wallet size={18} />, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500" },
  ];

  const quickActions = [
    { name: "Analitika", desc: "Hisobotlar va statistika", icon: <ChartColumn size={18} />, color: "text-blue-500", bg: "bg-blue-500/10", link: "/analytics" },
    { name: "Filiallar", desc: "3 ta filial", icon: <Building size={18} />, color: "text-cyan-500", bg: "bg-cyan-500/10", link: "/branches" },
    { name: "Menejerlar", desc: "12 ta menejer", icon: <Users size={18} />, color: "text-teal-500", bg: "bg-teal-500/10", link: "/managers" },
    { name: "To'lovlar", desc: "Moliyaviy hisobotlar", icon: <DollarSign size={18} />, color: "text-green-500", bg: "bg-green-500/10", link: "/payments" },
  ];

  const data = [
    { name: 'Yan', value: 4500000 }, { name: 'Fev', value: 5200000 },
    { name: 'Mart', value: 3800000 }, { name: 'Apr', value: 6100000 },
    { name: 'May', value: 5500000 }, { name: 'Iyun', value: 7200000 },
    { name: 'Iyul', value: 4800000 }, { name: 'Avg', value: 6500000 },
    { name: 'Sen', value: 7800000 }, { name: 'Okt', value: 8200000 },
    { name: 'Noy', value: 6900000 }, { name: 'Dek', value: 9100000 },
  ];

  return (
    <div className=" bg-slate-50 dark:bg-slate-950">
      <div className="space-y-6 w-full ">
        {/* Header */}
        <div>
          <Title text="Xush kelibsiz 👋" />
          <Text text="Ta'lim markazingiz holati va statistikalar" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item) => (
            <div key={item.id} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <span className={`absolute left-0 inset-y-0 w-1 ${item.border.replace('border-', 'bg-')}`}></span>
              <div className={`inline-flex p-2 rounded-lg ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-4">{item.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.title}</p>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Tezkor amallar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {quickActions.map((action, i) => (
              <Link href={action.link} key={i} className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                <div className={`flex justify-between items-start`}>
                  <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>{action.icon}</div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{action.name}</h3>
                  <p className="text-[11px] text-slate-400">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Analytics & Payments */}
        <FinancialChart />


        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white transition-colors">
                So'nggi to'lovlar
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Tizimdagi oxirgi qabul qilingan to'lovlar
              </p>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer group">
              Barchasi
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* ── RO'YXAT (LIST) ── */}
          <div className="space-y-2.5">
            {recentPayments.map((payment) => {
              const methodDetails = getMethodDetails(payment.method);

              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100/70 dark:border-slate-800/50 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-all duration-200 group"
                >
                  {/* Chap tomon: Ikonka + Ism va Filial */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 shadow-xs ${methodDetails.bg}`}>
                      {methodDetails.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {payment.studentName}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {payment.centerName}
                      </p>
                    </div>
                  </div>

                  {/* O'ng tomon: Summa + Vaqt */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block tracking-tight">
                      +{payment.amount}
                    </span>
                    <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{payment.time}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;
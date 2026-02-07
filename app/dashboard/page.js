'use client';

import Sidebar from '@/components/layout/Sidebar';
import {
  BarChart3,
  TrendingUp,
  Shield,
  Activity,
  Users,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LayoutDashboard,
  Box,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-950 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="font-semibold tracking-tight text-indigo-600 animate-pulse text-xs">Authorizing Access...</div>
      </div>
    );
  }

  const marketMetrics = [
    { label: 'Nifty 50', value: '24,201.35', change: '+0.85%', up: true },
    { label: 'Sensex', value: '79,482.90', change: '+1.02%', up: true },
    { label: 'Nasdaq', value: '18,506.10', change: '-0.14%', up: false },
    { label: 'Gold (24k)', value: '7,482.00', change: '+0.45%', up: true },
  ];

  const primaryStats = [
    { id: '1', title: 'Portfolio Management', metric: '₹14,58,200', sub: 'Est. Valuation', icon: PieChart, color: 'text-indigo-600', trend: '+₹12k today' },
    { id: '2', title: 'SIP Systematic Flow', metric: '₹25,000', sub: 'Monthly Commitment', icon: CreditCard, color: 'text-violet-600', trend: 'Next: Feb 15' },
    { id: '3', title: 'Risk Intelligence', metric: 'Strategic', sub: 'Risk Profile Level', icon: Shield, color: 'text-emerald-600', trend: 'Optimal' },
    { id: '4', title: 'Node Interaction', metric: '842', sub: 'AI Search Queries', icon: Activity, color: 'text-amber-600', trend: '+12% weekly' }
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFD] dark:bg-gray-950 transition-colors duration-300 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Top Header Section */}
        <header className="px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <LayoutDashboard size={18} className="text-gray-400" />
            <h1 className="text-xl font-sans font-semibold text-gray-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-indigo-600">{user?.fullname?.split(' ')[0] || 'Advisor'}</span>
            </h1>
          </div>
          <div className="flex items-center space-x-6 text-[12px] font-bold text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>Live Market: Open</span>
            </div>
            <span className="opacity-30">|</span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Market Ticker */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketMetrics.map((m, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col space-y-1">
                <span className="text-[10px] font-semibold tracking-tight text-gray-400 dark:text-gray-600">{m.label}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{m.value}</span>
                  <span className={`text-[10px] font-semibold tracking-tight flex items-center ${m.up ? 'text-emerald-500' : 'text-red-500'}`}>
                    {m.change}
                    {m.up ? <ArrowUpRight size={10} className="ml-0.5" /> : <ArrowDownRight size={10} className="ml-0.5" />}
                  </span>
                </div>
              </div>
            ))}
          </section>

          {/* Primary Metrics Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {primaryStats.map((stat) => (
              <div key={stat.id} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 group hover:border-indigo-100 dark:hover:border-indigo-900/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={18} />
                  </div>
                  <span className="text-[9px] font-semibold tracking-tight text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-sans font-semibold text-gray-900 dark:text-white leading-tight">{stat.title}</h3>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tracking-tighter">{stat.metric}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-tight">{stat.sub}</span>
                      <span className="text-[10px] text-indigo-500 font-semibold italic">{stat.trend}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Content Split: Allocation & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            {/* Allocation Section */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-base font-sans font-semibold text-gray-900 dark:text-white">Asset Category Performance</h2>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-tight cursor-pointer hover:underline">Analysis Details</span>
              </div>
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex-1">
                <div className="space-y-6">
                  {[
                    { cat: 'Equity Mutual Funds', value: '₹8,42,000', perc: 65, color: 'bg-indigo-600' },
                    { cat: 'Debt & Bond Funds', value: '₹3,24,000', perc: 25, color: 'bg-emerald-500' },
                    { cat: 'Liquid & Cash', value: '₹2,92,200', perc: 10, color: 'bg-amber-500' }
                  ].map((row, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{row.cat}</span>
                        <span className="font-bold text-gray-900 dark:text-white tracking-tight">{row.value}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${row.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${row.perc}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-semibold tracking-tight text-gray-400">
                        <span>Allocation: {row.perc}%</span>
                        <span className="text-indigo-500 italic">Expected Return: 12.4%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Network Status */}
            <div className="flex flex-col space-y-4">
              <h2 className="text-base font-sans font-semibold text-gray-900 dark:text-white px-2">Intelligence Hub</h2>
              <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group flex-1 flex flex-col justify-between">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Box size={80} />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold tracking-wider text-indigo-200">Execution Score</span>
                    <p className="text-3xl font-bold tracking-tighter">94.2%</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-indigo-100">AI Accuracy</span>
                      <span>High</span>
                    </div>
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[92%]"></div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-white text-indigo-700 rounded-xl text-sm font-semibold tracking-tight shadow-lg hover:bg-indigo-50 transition-all active:scale-[0.98]">
                    Refactor Strategy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Activity, Clock, Folder, CheckCircle, ArrowUpRight, Plus, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardOverview() {
  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back, Engineer</h1>
            <p className="text-slate-400">Here's what's happening with your hull designs today.</p>
          </div>
          <Link href="/dashboard/workspace">
            <Button className="bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Plus className="w-4 h-4 mr-2" />
              New Design
            </Button>
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          <KpiCard title="Active Projects" value="4" trend="+1 this week" icon={<Folder className="w-5 h-5" />} />
          <KpiCard title="CFD Simulations" value="12" trend="3 running now" icon={<Activity className="w-5 h-5 text-blue-400" />} />
          <KpiCard title="Compute Used" value="48.5h" trend="15h remaining" icon={<Clock className="w-5 h-5 text-purple-400" />} />
          <KpiCard title="Avg Efficiency" value="84%" trend="+2% vs avg" icon={<CheckCircle className="w-5 h-5 text-emerald-400" />} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Recent Projects List */}
          <div className="col-span-2 bg-[#0A0A0A]/80 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-white">Recent Designs</h2>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">View all</Button>
            </div>
            
            <div className="space-y-4">
              <ProjectRow name="Project Alpha - Fast Ferry" date="Updated 2h ago" status="Simulating" score={82} />
              <ProjectRow name="Oceanic Cargo V3" date="Updated yesterday" status="Optimized" score={94} />
              <ProjectRow name="Regatta Hull Concept" date="Updated 3 days ago" status="Draft" score={65} />
              <ProjectRow name="Patrol Vessel X1" date="Updated 1 week ago" status="Complete" score={88} />
            </div>
          </div>

          {/* AI Insights & Compute Usage */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </div>
                <h2 className="text-sm font-medium text-blue-400 uppercase tracking-wider">AI Insight</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Based on your recent iterations, adjusting the <strong>stern taper</strong> on "Oceanic Cargo" by 5% could yield a 2.4% reduction in wake turbulence.
              </p>
              <Button size="sm" className="w-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20">
                Apply to Workspace
              </Button>
            </div>

            <div className="bg-[#0A0A0A]/80 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
              <h2 className="text-lg font-medium text-white mb-6">Compute Usage</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">OpenFOAM Engine</span>
                    <span className="text-white font-mono">32h / 100h</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[32%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">ML Surrogate API</span>
                    <span className="text-white font-mono">1.2k / 10k req</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[12%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, icon }: any) {
  return (
    <div className="bg-[#0A0A0A]/80 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/[0.03] rounded-lg border border-white/5 shadow-inner">
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-400 bg-white/[0.03] px-2 py-1 rounded-full">{trend}</span>
      </div>
      <p className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</p>
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  );
}

function ProjectRow({ name, date, status, score }: any) {
  return (
    <Link href="/dashboard/workspace" className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center shadow-inner overflow-hidden">
           {/* Mock thumbnail */}
           <div className="w-6 h-6 border-[1.5px] border-blue-500/50 rounded-sm transform rotate-45 scale-y-50"></div>
        </div>
        <div>
          <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">{name}</h3>
          <p className="text-xs text-slate-500">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{score}/100</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Efficiency</p>
        </div>
        <div className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
          status === 'Simulating' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
          status === 'Optimized' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          'bg-slate-500/10 text-slate-400 border-slate-500/20'
        }`}>
          {status}
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
      </div>
    </Link>
  );
}

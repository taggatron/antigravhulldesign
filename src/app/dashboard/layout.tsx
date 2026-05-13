"use client";

import { Box, Settings, Activity, Folder, Database, LayoutDashboard, PanelRightClose, PanelRightOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: Folder },
  { name: 'Simulations', href: '/dashboard/simulations', icon: Activity },
  { name: 'Hull Data', href: '/dashboard/data', icon: Database },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showCopilot, setShowCopilot] = useState(true);

  return (
    <div className="flex h-screen bg-[#050505] text-slate-300">
      {/* Sidebar - Narrowed */}
      <div className="w-[72px] border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center py-4 z-20">
        <div className="mb-8">
          <Link href="/" className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/0 border border-primary/20 text-primary hover:shadow-[0_0_20px_rgba(var(--primary),0.2)] transition-all">
            <Box className="w-6 h-6" />
          </Link>
        </div>
        
        <div className="flex-1 w-full px-3">
          <div className="space-y-3 flex flex-col items-center">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl transition-all group relative",
                    isActive 
                      ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(var(--primary),0.1)] border border-primary/20" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                  title={item.name}
                >
                  <item.icon className="w-5 h-5" />
                  
                  {/* Tooltip */}
                  <span className="absolute left-14 px-2 py-1 bg-white/10 backdrop-blur-md text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none border border-white/10 whitespace-nowrap z-50 transition-opacity">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-4 mt-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 p-[2px] cursor-pointer hover:shadow-[0_0_15px_rgba(var(--primary),0.4)] transition-all" title="Engineer One">
            <div className="w-full h-full bg-black rounded-full border-2 border-transparent" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 relative z-10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium text-white tracking-tight">Hull Optima Alpha</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">Live</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCopilot(!showCopilot)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-sm text-slate-300 transition-all hover:text-white"
            >
              {showCopilot ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              {showCopilot ? 'Hide AI' : 'AI Copilot'}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative z-10">
          {children}
        </div>
      </main>

      {/* AI Copilot Right Sidebar */}
      {showCopilot && (
        <div className="w-[340px] bg-[#0A0A0A]/80 backdrop-blur-2xl flex flex-col h-full border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-20">
          <div className="h-16 border-b border-white/5 flex items-center px-5 justify-between bg-white/[0.01]">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </div>
              <span className="font-semibold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Copilot
              </span>
            </div>
            <Settings className="w-4 h-4 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-4 rounded-xl text-sm shadow-lg">
              <p className="text-white font-medium mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Analysis Complete
              </p>
              <p className="text-slate-400 leading-relaxed">
                Your current draft reduction improved wave resistance by <span className="text-emerald-400 font-medium">12%</span>. However, be careful with top speed stability at this beam width.
              </p>
            </div>
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-sm shadow-[0_0_30px_rgba(var(--primary),0.05)]">
              <p className="text-white font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Recommendation
              </p>
              <p className="text-primary/90 leading-relaxed">
                Increase stern taper slightly to reduce trailing wake turbulence. This could improve overall efficiency score by 2-3 points.
              </p>
              <button className="mt-3 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-xs font-medium transition-colors border border-primary/20">
                Apply Suggestion
              </button>
            </div>
          </div>

          <div className="p-5 border-t border-white/5 bg-black/20">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask engineering copilot..." 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black transition-colors">
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

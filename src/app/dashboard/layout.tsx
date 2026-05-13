"use client";

import { Box, Settings, Activity, Folder, Database, LayoutDashboard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Box className="w-5 h-5 text-primary" />
            <span className="font-bold tracking-tight">AI Hull Lab</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Engineer One</p>
              <p className="text-xs text-muted-foreground truncate">Team Workspace</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative border-r border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="h-full overflow-y-auto relative z-10">
          {children}
        </div>
      </main>

      {/* AI Copilot Right Sidebar */}
      <div className="w-80 bg-black/40 backdrop-blur-xl flex flex-col h-full border-l border-white/10">
        <div className="h-16 border-b border-white/10 flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium text-sm">AI Copilot</span>
          </div>
          <Settings className="w-4 h-4 text-muted-foreground" />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white/5 border border-white/5 p-3 rounded-lg text-sm text-muted-foreground">
            <p className="text-white mb-1">Analysis Complete</p>
            Your current draft reduction improved wave resistance by 12%. However, be careful with top speed stability at this beam width.
          </div>
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg text-sm text-primary">
            <p className="font-medium mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Recommended Action
            </p>
            Increase stern taper slightly to reduce trailing wake turbulence.
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <input 
            type="text" 
            placeholder="Ask engineering copilot..." 
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}

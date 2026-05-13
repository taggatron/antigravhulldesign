"use client";

import HullViewer from "@/components/viewer3d/HullViewer";
import { useHullStore } from "@/store/hullStore";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Play, Download, Wand2, Zap, GaugeCircle, Move3d } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { 
    beam, length, draft, bowSharpness, sternTaper, 
    setParam, predictions, updatePredictions, isPredicting, setPredicting 
  } = useHullStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runPrediction = async () => {
    setPredicting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/predict?beam=${beam}&length=${length}&draft=${draft}&bow_sharpness=${bowSharpness}`);
      if (res.ok) {
        const data = await res.json();
        updatePredictions(data);
      } else {
        throw new Error("API failed");
      }
    } catch (e) {
      setTimeout(() => {
        const drag_coeff = 0.04 * (beam / length) + 0.01 * (draft / length) - 0.005 * bowSharpness;
        updatePredictions({
          drag_coefficient: Number(Math.max(0.01, drag_coeff).toFixed(4)),
          wave_resistance: Number((drag_coeff * 1.5).toFixed(4)),
          efficiency_score: Number((100 - (drag_coeff * 1000)).toFixed(1)),
          top_speed_estimate: Number((30 + (bowSharpness * 0.1) - (drag_coeff * 50)).toFixed(1))
        });
      }, 500);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    
    const timeoutId = setTimeout(() => {
      runPrediction();
    }, 150);
    
    return () => clearTimeout(timeoutId);
  }, [mounted, beam, length, draft, bowSharpness, sternTaper]);

  if (!mounted) return null;

  return (
    <div className="h-full flex p-5 gap-6">
      {/* Sidebar Controls */}
      <div className="w-[380px] shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Real-time Telemetry Card */}
        <Card className="bg-[#0D0D0D]/80 backdrop-blur-2xl border-white/5 shadow-2xl rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="pb-4 border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-sm font-medium tracking-wide flex items-center gap-2 text-white/90">
              <Activity className="w-4 h-4 text-primary" />
              Live Telemetry
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Instant ML surrogate model predictions</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 gap-3">
              <MetricBox 
                label="Drag Coeff (Cd)" 
                value={predictions?.drag_coefficient || "..."} 
                loading={isPredicting}
                trend="down"
                icon={<GaugeCircle className="w-3 h-3 text-white/40" />}
              />
              <MetricBox 
                label="Efficiency" 
                value={predictions?.efficiency_score ? `${predictions.efficiency_score}/100` : "..."} 
                loading={isPredicting}
                trend="up"
                icon={<Zap className="w-3 h-3 text-white/40" />}
              />
              <MetricBox 
                label="Wave Resistance" 
                value={predictions?.wave_resistance || "..."} 
                loading={isPredicting}
              />
              <MetricBox 
                label="Est. Top Speed" 
                value={predictions?.top_speed_estimate ? `${predictions.top_speed_estimate} kn` : "..."} 
                loading={isPredicting}
                trend="up"
              />
            </div>
          </CardContent>
        </Card>

        {/* Morphing Controls */}
        <Card className="bg-[#0D0D0D]/80 backdrop-blur-2xl border-white/5 shadow-2xl rounded-2xl flex-1 flex flex-col relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="pb-4 border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-sm font-medium tracking-wide flex items-center gap-2 text-white/90">
              <Move3d className="w-4 h-4 text-purple-400" />
              Geometry Morphing
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Adjust hull parameters in real-time</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-7 flex-1 overflow-y-auto">
            <ControlSlider label="Length (LOA)" value={length} min={20} max={150} onChange={(v) => setParam('length', v)} unit="m" />
            <ControlSlider label="Beam Width" value={beam} min={5} max={40} onChange={(v) => setParam('beam', v)} unit="m" />
            <ControlSlider label="Draft" value={draft} min={1} max={15} step={0.5} onChange={(v) => setParam('draft', v)} unit="m" />
            <ControlSlider label="Bow Sharpness" value={bowSharpness} min={0} max={100} onChange={(v) => setParam('bowSharpness', v)} unit="%" />
            <ControlSlider label="Stern Taper" value={sternTaper} min={0} max={100} onChange={(v) => setParam('sternTaper', v)} unit="%" />
          </CardContent>
        </Card>

      </div>

      {/* Main 3D View */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="flex-1 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(var(--primary),0.1)] border border-white/5 bg-[#050505] relative group">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <HullViewer />
        </div>
        
        {/* Bottom Action Bar */}
        <div className="h-16 bg-[#0D0D0D]/80 backdrop-blur-2xl border border-white/5 rounded-2xl flex items-center justify-between px-6 shadow-xl shrink-0">
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all border-0 h-9">
              <Play className="w-4 h-4 mr-2 fill-current" />
              Queue High-Fi CFD
            </Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/[0.05] h-9 text-slate-300">
              <Wand2 className="w-4 h-4 mr-2 text-purple-400" />
              Auto-Optimize
            </Button>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-white h-9">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, loading, trend, icon }: { label: string, value: string | number, loading?: boolean, trend?: 'up' | 'down', icon?: React.ReactNode }) {
  return (
    <div className="bg-[#050505]/50 p-3.5 rounded-xl border border-white/[0.03] relative overflow-hidden group hover:border-white/[0.08] transition-colors">
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/5 animate-pulse" 
          />
        )}
      </AnimatePresence>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        {icon}
      </div>
      <p className="text-xl font-mono font-medium text-white flex items-center gap-2">
        {value}
        {trend === 'up' && <span className="text-emerald-400 text-sm">↑</span>}
        {trend === 'down' && <span className="text-blue-400 text-sm">↓</span>}
      </p>
    </div>
  );
}

function ControlSlider({ label, value, min, max, step = 1, unit = "", onChange }: any) {
  return (
    <div className="space-y-3 group">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors uppercase tracking-wider">{label}</label>
        <div className="bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded text-xs font-mono text-primary shadow-inner">
          {value}{unit}
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
        className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-4 [&_[role=slider]]:border-primary [&_[role=slider]]:shadow-[0_0_10px_rgba(var(--primary),0.5)] [&_[role=slider]]:w-4 [&_[role=slider]]:h-4"
      />
    </div>
  );
}

"use client";

import HullViewer from "@/components/viewer3d/HullViewer";
import { useHullStore } from "@/store/hullStore";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Play, Download, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";

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
      // For the mock, we can just hit the local API or simulate it if the API is down
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/predict?beam=${beam}&length=${length}&draft=${draft}&bow_sharpness=${bowSharpness}`);
      if (res.ok) {
        const data = await res.json();
        updatePredictions(data);
      } else {
        throw new Error("API failed");
      }
    } catch (e) {
      // Fallback mock if backend isn't running yet
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

  // Run predictions when hull parameters change
  useEffect(() => {
    if (mounted) {
      runPrediction();
    }
  }, [mounted, beam, length, draft, bowSharpness, sternTaper]);

  if (!mounted) return null;

  return (
    <div className="h-full flex p-4 gap-4">
      {/* Sidebar Controls */}
      <div className="w-[400px] shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
        
        {/* Real-time Telemetry Card */}
        <Card className="bg-black/40 backdrop-blur-md border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Live Telemetry
            </CardTitle>
            <CardDescription>Instant surrogate model predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <MetricBox 
                label="Drag Coeff (Cd)" 
                value={predictions?.drag_coefficient || "..."} 
                loading={isPredicting}
                trend="down"
              />
              <MetricBox 
                label="Efficiency Score" 
                value={predictions?.efficiency_score ? `${predictions.efficiency_score}/100` : "..."} 
                loading={isPredicting}
                trend="up"
              />
              <MetricBox 
                label="Wave Resistance" 
                value={predictions?.wave_resistance || "..."} 
                loading={isPredicting}
              />
              <MetricBox 
                label="Top Speed Est." 
                value={predictions?.top_speed_estimate ? `${predictions.top_speed_estimate} kn` : "..."} 
                loading={isPredicting}
                trend="up"
              />
            </div>
          </CardContent>
        </Card>

        {/* Morphing Controls */}
        <Card className="bg-black/40 backdrop-blur-md border-white/10 flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              Geometry Morphing
            </CardTitle>
            <CardDescription>Adjust hull parameters in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ControlSlider label="Length (LOA)" value={length} min={20} max={150} onChange={(v) => setParam('length', v)} unit="m" />
            <ControlSlider label="Beam Width" value={beam} min={5} max={40} onChange={(v) => setParam('beam', v)} unit="m" />
            <ControlSlider label="Draft" value={draft} min={1} max={15} step={0.5} onChange={(v) => setParam('draft', v)} unit="m" />
            <ControlSlider label="Bow Sharpness" value={bowSharpness} min={0} max={100} onChange={(v) => setParam('bowSharpness', v)} unit="%" />
            <ControlSlider label="Stern Taper" value={sternTaper} min={0} max={100} onChange={(v) => setParam('sternTaper', v)} unit="%" />
          </CardContent>
        </Card>

      </div>

      {/* Main 3D View */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
          <HullViewer />
        </div>
        
        {/* Bottom Action Bar */}
        <div className="h-20 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-between px-6">
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Queue High-Fi CFD
            </Button>
            <Button variant="outline" className="border-white/10">
              <Wand2 className="w-4 h-4 mr-2" />
              Auto-Optimize
            </Button>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Engineering Report
          </Button>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, loading, trend }: { label: string, value: string | number, loading?: boolean, trend?: 'up' | 'down' }) {
  return (
    <div className="bg-white/5 p-3 rounded-lg border border-white/5 relative overflow-hidden">
      {loading && <div className="absolute inset-0 bg-primary/10 animate-pulse" />}
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-mono font-semibold text-white flex items-center gap-2">
        {value}
        {trend === 'up' && <span className="text-green-400 text-xs">↑</span>}
        {trend === 'down' && <span className="text-blue-400 text-xs">↓</span>}
      </p>
    </div>
  );
}

function ControlSlider({ label, value, min, max, step = 1, unit = "", onChange }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-sm font-mono text-primary">{value}{unit}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
        className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
      />
    </div>
  );
}

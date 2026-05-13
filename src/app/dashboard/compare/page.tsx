"use client";

import { useHullStore } from "@/store/hullStore";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Grid, MeshReflectorMaterial } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";

// A static hull representing a baseline design
function BaselineHull() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const l = 10;
    const b = 3;
    const d = 1.5;
    const geo = new THREE.BoxGeometry(2, 1, 6, 16, 8, 32);
    
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      const nz = z / 3;
      if (nz > 0) x *= (1 - nz * 0.8);
      if (nz < 0) {
        x *= (1 - Math.abs(nz) * 0.4);
        y += Math.abs(nz) * 0.3;
      }
      const ny = y / 0.5;
      if (ny < 0) x *= (1 - Math.abs(ny) * 0.5);
      
      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        pos.setXYZ(i, 0, 0, 0);
      } else {
        pos.setXYZ(i, x, y, z);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05 + 0.75;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial 
        color="#1f2937" // Slate 800
        metalness={0.5}
        roughness={0.5}
        clearcoat={0.5}
      />
    </mesh>
  );
}

// Current procedural hull
function CurrentHull() {
  const { beam, length, draft, bowSharpness, sternTaper } = useHullStore();
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const l = Math.max(0.1, length / 10);
    const b = Math.max(0.1, beam / 5);
    const d = Math.max(0.1, draft / 2);
    const geo = new THREE.BoxGeometry(b, d, l, 64, 32, 128);
    const pos = geo.attributes.position;
    const halfL = l / 2 || 1;
    const halfD = d / 2 || 1;

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      const nz = z / halfL;
      if (nz > 0) x *= (1 - (nz * (bowSharpness / 100)));
      if (nz < 0) {
        x *= (1 - Math.abs(nz) * (sternTaper / 100));
        y += Math.abs(nz) * (d * 0.2);
      }
      const ny = y / halfD;
      if (ny < 0) x *= (1 - Math.abs(ny) * 0.8);
      
      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        pos.setXYZ(i, 0, 0, 0);
      } else {
        pos.setXYZ(i, x, y, z);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, [beam, length, draft, bowSharpness, sternTaper]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05 + (draft / 4);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial 
        color="#000000"
        metalness={0.9}
        roughness={0.2}
        clearcoat={1.0}
        envMapIntensity={2.0}
      />
    </mesh>
  );
}

export default function ComparePage() {
  const { predictions } = useHullStore();
  const baselinePredictions = {
    drag_coefficient: 0.045,
    wave_resistance: 0.068,
    efficiency_score: 72,
    top_speed_estimate: 24.5
  };

  return (
    <div className="h-full flex flex-col p-5 gap-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Design Comparison</h1>
          <p className="text-slate-400 text-sm">Comparing Baseline V1 to your current Workspace iterations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Sync Cameras
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Diff Report
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        
        {/* Baseline View */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-[#020202] relative shadow-lg">
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/50 backdrop-blur rounded text-xs text-slate-400 font-mono border border-white/10">
              BASELINE V1
            </div>
            <Canvas camera={{ position: [10, 5, 10], fov: 45 }} shadows>
              <ambientLight intensity={0.2} />
              <spotLight position={[10, 20, 10]} intensity={1} castShadow />
              <Environment files="/env/potsdamer_platz_4k.hdr" />
              <BaselineHull />
              <Grid position={[0, 0, 0]} infiniteGrid cellColor="#333" sectionColor="#444" fadeDistance={20} />
              <OrbitControls makeDefault minDistance={5} maxDistance={50} />
            </Canvas>
          </div>
          
          <Card className="bg-[#0A0A0A] border-white/5 p-4 shrink-0">
             <div className="grid grid-cols-4 gap-4 text-center">
               <Metric label="Drag" value={baselinePredictions.drag_coefficient} />
               <Metric label="Wave Res" value={baselinePredictions.wave_resistance} />
               <Metric label="Speed" value={`${baselinePredictions.top_speed_estimate}kn`} />
               <Metric label="Score" value={`${baselinePredictions.efficiency_score}/100`} />
             </div>
          </Card>
        </div>

        {/* Current Workspace View */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-2xl overflow-hidden border border-blue-500/30 bg-[#020202] relative shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-blue-500/20 backdrop-blur rounded text-xs text-blue-400 font-mono border border-blue-500/30">
              CURRENT ITERATION
            </div>
            <Canvas camera={{ position: [10, 5, 10], fov: 45 }} shadows>
              <ambientLight intensity={0.2} />
              <spotLight position={[10, 20, 10]} intensity={2} color="#3b82f6" castShadow />
              <pointLight position={[-10, -10, -10]} color="#1d4ed8" intensity={5} />
              <Environment files="/env/potsdamer_platz_4k.hdr" />
              <CurrentHull />
              <Grid position={[0, 0, 0]} infiniteGrid cellColor="#1d4ed8" sectionColor="#3b82f6" fadeDistance={30} />
              <OrbitControls makeDefault minDistance={5} maxDistance={50} />
            </Canvas>
          </div>

          <Card className="bg-[#0A0A0A] border-white/5 p-4 shrink-0">
             <div className="grid grid-cols-4 gap-4 text-center">
               <Metric 
                 label="Drag" 
                 value={predictions?.drag_coefficient || "..."} 
                 delta={calculateDelta(baselinePredictions.drag_coefficient, predictions?.drag_coefficient, true)}
               />
               <Metric 
                 label="Wave Res" 
                 value={predictions?.wave_resistance || "..."} 
                 delta={calculateDelta(baselinePredictions.wave_resistance, predictions?.wave_resistance, true)}
               />
               <Metric 
                 label="Speed" 
                 value={predictions?.top_speed_estimate ? `${predictions.top_speed_estimate}kn` : "..."} 
                 delta={calculateDelta(baselinePredictions.top_speed_estimate, predictions?.top_speed_estimate, false)}
               />
               <Metric 
                 label="Score" 
                 value={predictions?.efficiency_score ? `${predictions.efficiency_score}/100` : "..."} 
                 delta={calculateDelta(baselinePredictions.efficiency_score, predictions?.efficiency_score, false)}
               />
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

function calculateDelta(baseline: number, current: number | undefined, lowerIsBetter: boolean) {
  if (current === undefined || isNaN(current)) return null;
  const diff = current - baseline;
  if (Math.abs(diff) < 0.001) return null;
  
  let isGood = lowerIsBetter ? diff < 0 : diff > 0;
  
  return {
    value: diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2),
    isGood
  };
}

function Metric({ label, value, delta }: any) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-white font-mono">{value}</span>
        {delta && (
          <span className={`text-[10px] font-bold ${delta.isGood ? 'text-emerald-400' : 'text-red-400'}`}>
            {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}

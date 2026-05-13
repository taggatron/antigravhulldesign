"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, Box, Zap, BarChart2, Shield, Settings, Server, Cpu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function HeroHull() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
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
      if (y / 0.5 < 0) x *= (1 - Math.abs(y / 0.5) * 0.5);
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current && wireframeRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
      meshRef.current.position.y = Math.sin(time) * 0.1;
      
      wireframeRef.current.rotation.copy(meshRef.current.rotation);
      wireframeRef.current.position.copy(meshRef.current.position);
      wireframeRef.current.scale.setScalar(1.01);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial 
          color="#000000"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          envMapIntensity={2.0}
        />
      </mesh>
      <mesh ref={wireframeRef} geometry={geometry}>
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(29,78,216,0.1),_transparent_60%)]" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[150px]" />
        
        {/* Particle/Grid Overlay simulating water/tech */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-[1px]">
              <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center">
                <Box className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">AI Hull Lab</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#benchmarks" className="hover:text-white transition-colors">Benchmarks</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-white/5">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-6 min-h-[90vh] flex flex-col justify-center">
          {/* 3D Canvas Background */}
          <div className="absolute inset-0 z-[-1] opacity-60">
             <Canvas camera={{ position: [10, 5, 10], fov: 40 }}>
               <ambientLight intensity={0.5} />
               <directionalLight position={[10, 10, 5]} intensity={1.5} />
               <pointLight position={[-10, -10, -10]} color="#1e40af" intensity={2} />
               <HeroHull />
             </Canvas>
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/50 to-[#020202]" />
          </div>

          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-sm font-medium mb-8 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-slate-300">Simulation Engine v2.0 Live</span>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">Hydrodynamics,</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-white">accelerated by AI.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
            >
              The browser-based marine engineering platform. Upload, visualize, modify, and rapidly optimize vessel hull designs using instantaneous AI predictions.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/auth/register">
                <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-white/90 rounded-full w-full sm:w-auto transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  Start Optimizing <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5 w-full sm:w-auto backdrop-blur-md">
                View Documentation
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Customer Logos */}
        <section className="py-10 border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mb-8">Trusted by advanced engineering teams</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
               {/* Placeholders for logos */}
               <div className="flex items-center gap-2 font-bold text-2xl"><Box /> OCEANIC</div>
               <div className="flex items-center gap-2 font-bold text-2xl"><Settings /> NAUTICA</div>
               <div className="flex items-center gap-2 font-bold text-2xl"><Zap /> AEROFOIL</div>
               <div className="flex items-center gap-2 font-bold text-2xl"><Shield /> MARITIME</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">From days to minutes.</h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto">Replace fragmented workflows with a unified, browser-based environment powered by advanced machine learning.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<Move3DIcon />}
                title="Live Geometry Morphing"
                description="Tweak beam width, draft, and bow sharpness in real-time. Watch the 3D model respond instantly to your inputs."
              />
              <FeatureCard 
                icon={<Activity className="w-6 h-6 text-green-400" />}
                title="Instant Hydrodynamics"
                description="Our surrogate ML models predict drag coefficient, wave resistance, and top speed instantly without waiting hours."
              />
              <FeatureCard 
                icon={<Server className="w-6 h-6 text-purple-400" />}
                title="Cloud CFD Integration"
                description="Queue deeper OpenFOAM jobs right from your browser. We handle mesh generation and distributed cloud compute."
              />
              <FeatureCard 
                icon={<BarChart2 className="w-6 h-6 text-blue-400" />}
                title="Design Comparison"
                description="Compare multiple hull iterations side-by-side. View delta heatmaps and performance radar charts."
              />
              <FeatureCard 
                icon={<Cpu className="w-6 h-6 text-orange-400" />}
                title="AI Copilot"
                description="An embedded engineering assistant that explains simulation outputs and recommends geometric optimizations."
              />
              <FeatureCard 
                icon={<Zap className="w-6 h-6 text-yellow-400" />}
                title="Automated Reports"
                description="Generate comprehensive PDF engineering reports with renders, metrics, and optimization summaries."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6 bg-gradient-to-b from-transparent to-blue-900/10">
           <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Transparent Pricing</h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto">Compute-based pricing for teams of all sizes.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingCard 
                name="Starter"
                price="Free"
                description="For students and open-source evaluation."
                features={["5 Hull Saves", "Basic ML Predictions", "Community Support", "Public Models Only"]}
              />
              <PricingCard 
                name="Professional"
                price="$299"
                period="/mo"
                description="For naval architects and independent engineers."
                features={["Unlimited Hull Saves", "Advanced Surrogate Models", "100 CFD Cloud Hours/mo", "Private Models", "Export Reports"]}
                popular
              />
              <PricingCard 
                name="Enterprise"
                price="Custom"
                description="For large firms and maritime organizations."
                features={["Unlimited CFD Compute", "Custom Model Tuning", "API Access", "Dedicated Copilot Training", "SLA Support"]}
              />
            </div>
           </div>
        </section>
      </main>
    </div>
  );
}

function Move3DIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
      <path d="M5 3v16h16" />
      <path d="m5 19 6-6" />
      <path d="m2 6 3-3 3 3" />
      <path d="m18 16 3 3-3 3" />
    </svg>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group shadow-lg shadow-black/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-6 shadow-inner relative z-10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white relative z-10">{title}</h3>
      <p className="text-slate-400 leading-relaxed relative z-10">
        {description}
      </p>
    </div>
  );
}

function PricingCard({ name, price, period = "", description, features, popular = false }: any) {
  return (
    <div className={`p-8 rounded-3xl border relative flex flex-col ${popular ? 'bg-gradient-to-b from-blue-900/20 to-transparent border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'bg-white/[0.02] border-white/5'}`}>
      {popular && (
         <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
           Most Popular
         </div>
      )}
      <h3 className="text-xl font-medium text-white mb-2">{name}</h3>
      <p className="text-slate-400 text-sm mb-6">{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="text-slate-500">{period}</span>
      </div>
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link href="/auth/register">
        <Button className={`w-full ${popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
          Get Started
        </Button>
      </Link>
    </div>
  )
}

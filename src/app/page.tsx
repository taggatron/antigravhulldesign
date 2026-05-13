"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, Box, Zap, Settings, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">AI Hull Lab</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-white">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-white text-black hover:bg-white/90">
                Go to App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Simulation Engine v2.0 Live
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-8"
          >
            Hydrodynamics,<br />accelerated by AI.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-light"
          >
            The browser-based marine engineering platform. Upload, visualize, modify, and rapidly optimize vessel hull designs using instantaneous AI predictions and lightweight CFD workflows.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-white/90 rounded-full w-full sm:w-auto">
                Start Optimizing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5 w-full sm:w-auto">
              View Documentation
            </Button>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto mt-32 grid md:grid-cols-3 gap-6 relative z-10">
          <FeatureCard 
            icon={<Box className="w-6 h-6 text-blue-400" />}
            title="Live Geometry Morphing"
            description="Tweak beam width, draft, and bow sharpness in real-time. Watch the 3D model respond instantly to your inputs."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-green-400" />}
            title="Instant Hydrodynamics"
            description="Our surrogate ML models predict drag coefficient and wave resistance instantly without waiting for hours."
            delay={0.5}
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="AI-Assisted CFD"
            description="Queue deeper OpenFOAM jobs right from your browser. We handle the mesh generation and cloud compute."
            delay={0.6}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

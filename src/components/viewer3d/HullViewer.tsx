"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Grid, ContactShadows } from "@react-three/drei";
import { useHullStore } from "@/store/hullStore";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

function ProceduralHull() {
  const { beam, length, draft, bowSharpness, sternTaper } = useHullStore();
  const meshRef = useRef<THREE.Mesh>(null);

  // Procedurally generate hull based on parameters
  const geometry = useMemo(() => {
    // Start with a basic box, scaled by length, beam, and draft.
    const l = length / 10;
    const b = beam / 5;
    const d = draft / 2;
    const geo = new THREE.BoxGeometry(b, d, l, 32, 16, 64);
    
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Normalize z from -1 (stern) to 1 (bow)
      const nz = z / (l / 2);

      // Apply Bow Sharpness (taper width towards the bow)
      if (nz > 0) {
        const factor = 1 - (nz * (bowSharpness / 100));
        x *= factor;
      }

      // Apply Stern Taper
      if (nz < 0) {
        const factor = 1 - (Math.abs(nz) * (sternTaper / 100));
        x *= factor;
        // Lift the stern slightly
        y += Math.abs(nz) * (d * 0.2);
      }

      // V-shape hull logic (bottom gets narrower)
      const ny = (y / (d / 2)); // 1 is top, -1 is bottom
      if (ny < 0) {
        x *= (1 - Math.abs(ny) * 0.8);
      }

      pos.setXYZ(i, x, y, z);
    }

    geo.computeVertexNormals();
    return geo;
  }, [beam, length, draft, bowSharpness, sternTaper]);

  // Prevent memory leaks by disposing of old geometries
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rocking motion like floating on water
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05 + (draft / 4);
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#1e40af" // Deep blue
          metalness={0.7}
          roughness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          wireframe={false}
        />
      </mesh>
      
      {/* Wireframe overlay for "Engineering" feel */}
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export default function HullViewer() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black rounded-xl overflow-hidden border border-white/10 relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="px-3 py-1 bg-black/50 backdrop-blur rounded text-xs text-blue-400 font-mono border border-blue-500/30">
          WEBGL RENDERER
        </div>
        <div className="px-3 py-1 bg-black/50 backdrop-blur rounded text-xs text-green-400 font-mono border border-green-500/30">
          LIVE MORPH ACTIVE
        </div>
      </div>

      <Canvas camera={{ position: [10, 5, 10], fov: 45 }} shadows>
        <color attach="background" args={['#050505']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} color="#1e40af" intensity={2} />
        
        <ProceduralHull />

        <Grid 
          renderOrder={-1} 
          position={[0, 0, 0]} 
          infiniteGrid 
          cellSize={1} 
          cellThickness={0.5} 
          sectionSize={5} 
          sectionThickness={1} 
          fadeDistance={30} 
          cellColor="#333333" 
          sectionColor="#444444" 
        />
        
        <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={20} blur={2} far={10} />
        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 + 0.1} minDistance={5} maxDistance={50} />
      </Canvas>
    </div>
  );
}

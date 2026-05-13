"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Grid, ContactShadows, MeshReflectorMaterial, Float } from "@react-three/drei";
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
    const geo = new THREE.BoxGeometry(b, d, l, 64, 32, 128); // Increased geometry resolution
    
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
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.01;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#000000" // Dark grey/black for carbon-fiber look
          metalness={0.9}
          roughness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          envMapIntensity={2.0}
          wireframe={false}
        />
      </mesh>
      
      {/* Wireframe overlay for "Engineering" feel */}
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function WaterPlane() {
  return (
    <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={1}
      />
    </mesh>
  );
}

export default function HullViewer({ showGrid = true }: { showGrid?: boolean }) {
  return (
    <div className="w-full h-full bg-[#020202] rounded-xl overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="px-3 py-1 bg-black/50 backdrop-blur rounded text-[10px] text-blue-400 font-mono border border-blue-500/30 uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          WebGL Renderer
        </div>
        <div className="px-3 py-1 bg-black/50 backdrop-blur rounded text-[10px] text-emerald-400 font-mono border border-emerald-500/30 uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          Live Morph Active
        </div>
      </div>

      <Canvas camera={{ position: [12, 6, 12], fov: 45 }} shadows>
        <color attach="background" args={['#020202']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow shadow-bias={-0.0001} />
        <pointLight position={[-10, -10, -10]} color="#1d4ed8" intensity={5} />
        <pointLight position={[10, -10, 10]} color="#7e22ce" intensity={3} />
        
        {/* Environment mapping for reflections */}
        <Environment preset="city" />
        
        <ProceduralHull />
        <WaterPlane />

        {showGrid && (
          <Grid 
            renderOrder={-1} 
            position={[0, 0.11, 0]} 
            infiniteGrid 
            cellSize={1} 
            cellThickness={0.5} 
            sectionSize={5} 
            sectionThickness={1} 
            fadeDistance={30} 
            cellColor="#1d4ed8" 
            sectionColor="#3b82f6" 
            fadeStrength={1}
          />
        )}
        
        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} minDistance={5} maxDistance={50} />
      </Canvas>
    </div>
  );
}

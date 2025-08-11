import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, SpotLight } from "@react-three/drei";
import * as THREE from "three";

// ----------------- Realistic Flame (Shader + Vertex Displacement) -----------------
function RealisticFlame({ launched }) {
  const meshRef = useRef();

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, // makes flame glow
      uniforms: {
        time: { value: 0 },
        colorCore: { value: new THREE.Color("#fff8cc") }, // warmer soft white
        colorMid: { value: new THREE.Color("#ffcc33") },  // golden yellow
        colorOuter: { value: new THREE.Color("#ff6600") }, // bright orange
        amplitude: { value: 0.35 },
        speed: { value: 2.5 },
      },
      vertexShader: `
        uniform float time;
        uniform float amplitude;
        uniform float speed;
        varying vec2 vUv;
        varying float vNoise;

        // 2D hash / noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
        }
        float noise(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          // four corners in 2D of a tile
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vUv = uv;

          // base position
          vec3 pos = position;

          // sample noise based on uv and time to create turbulence
          float n = noise(vec2(uv.x * 6.0, uv.y * 3.0 + time * speed));

          // stronger displacement near the edges and near the base
          float edge = smoothstep(0.0, 0.6, uv.y);
          float displacement = (n - 0.5) * amplitude * edge * (1.0 + 0.5 * sin(time * 4.0 + uv.x * 10.0));

          // push vertices outward and swirl slightly
          pos.x += displacement * (1.0 - uv.y) * (uv.x - 0.5) * 2.0;
          pos.z += displacement * (uv.x - 0.5) * 2.0;

          // elongate slightly with time to simulate flow (breathing)
          pos.y *= 1.0 + 0.15 * sin(time * 2.0 + uv.x * 5.0);

          vNoise = n;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorCore;
        uniform vec3 colorMid;
        uniform vec3 colorOuter;
        varying vec2 vUv;
        varying float vNoise;

        // simple hash/noise repeat for flicker
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          // vertical gradient: white-hot core near base (vUv.y small), cooler toward tip
          float y = vUv.y;

          // mix colors based on height
          vec3 col = mix(colorCore, colorMid, smoothstep(0.0, 0.4, y));
          col = mix(col, colorOuter, smoothstep(0.35, 0.9, y));

          // dynamic flicker noise
          float n = noise(vec2(vUv.x * 8.0, vUv.y * 4.0 + time * 6.0));
          col += (n - 0.5) * 0.35; // subtle color variation

          // stronger brightness near base
          float baseBoost = smoothstep(0.0, 0.15, 1.0 - y) * 1.2;
          col += baseBoost * 0.6;

          // alpha fades towards tip, multiplied by flicker for realism
          float alpha = (1.0 - y) * (0.75 + 0.25 * sin(time * 20.0 + vUv.x * 10.0));
          alpha *= smoothstep(1.0, 0.0, y * 1.2); // ensure tip fades more

          // thin wispy edges: reduce alpha at outermost UV.x extremes
          float edgeFade = smoothstep(0.0, 0.02, abs(vUv.x - 0.5));
          alpha *= 1.0 - edgeFade * 0.9;

          // final output
          gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
        }
      `,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    material.uniforms.time.value = t;
    // visibility based on launch
    if (meshRef.current) {
      meshRef.current.visible = launched;
      // small extra scaling while launched
      meshRef.current.scale.set(
        1.0,
        launched ? 1.0 + 0.6 * Math.abs(Math.sin(t * 3.0)) : 1.0,
        1.0
      );
    }
  });

  // Add a point light to simulate flame glow (parented to flame mesh)
  return (
    <group position={[0, -3.5, 0]}>
      <mesh ref={meshRef}>
        {/* openEnded cone so tip looks wispy */}
        <coneGeometry args={[0.7, 2.2, 48, 12, true]} />
        <primitive attach="material" object={material} />
      </mesh>

      {/* Flames emit light — subtle point light to illuminate rocket base */}
      <pointLight
        intensity={2.2}
        distance={8}
        decay={2}
        color={"#ff8a00"}
        position={[0, -0.5, 0]}
      />
    </group>
  );
}

// ----------------- RocketModel -----------------
function RocketModel({ launched, onLaunchComplete }) {
  const rocketRef = useRef();

  useFrame((state, delta) => {
    if (launched) {
      if (rocketRef.current.position.y < 30) {
        rocketRef.current.position.y += delta * 40; // increased speed
        rocketRef.current.rotation.x += delta * 2.0; // faster rotation for effect
      } else {
        onLaunchComplete?.();
      }
    } else {
      // reset
      rocketRef.current.position.y = 0;
      rocketRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={rocketRef} position={[0, 0, 0]}>
      {/* Main Body (Light Gray) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 6, 32]} />
        <meshStandardMaterial
          color="#f0f0f0"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Fuel Tank Section (Bright Orange) */}
      <mesh position={[0, -3, 0]} castShadow>
        <cylinderGeometry args={[1.05, 1.05, 2, 32]} />
        <meshStandardMaterial
          color="#FF7F00"
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>

      {/* Nose Cone / Payload Fairing (Glossy White) */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[1, 2, 32]} />
        <meshStandardMaterial
          color="#FAFAFA"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      {/* Nose Cone Detail Markings (Black Panels) */}
      <mesh position={[0.6, 4.3, 0.3]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Engines & Thrusters (Metallic Dark Gray with Orange Glow) */}
      <mesh position={[0, -4, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 0.7, 32]} />
        <meshStandardMaterial
          color="#606060"
          emissive="#FF6F00"
          emissiveIntensity={0.7}
          metalness={1.0}
          roughness={0.3}
        />
      </mesh>

      {/* Decals / Logos (Bright Red) */}
      <mesh position={[0, 1.5, 1.01]} castShadow>
        <planeGeometry args={[0.8, 0.3]} />
        <meshStandardMaterial color="#FF2200" />
      </mesh>

      {/* Realistic flame */}
      <RealisticFlame launched={launched} />
    </group>
  );
}

// ----------------- Rocket Wrapper -----------------
export default function Rocket({ launch = false, onLaunchComplete }) {
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    if (launch) setLaunched(true);
  }, [launch]);

  useEffect(() => {
    if (launched) {
      const timer = setTimeout(() => {
        setLaunched(false);
        onLaunchComplete?.();
      }, 4000); // keep flame for a bit longer
      return () => clearTimeout(timer);
    }
  }, [launched, onLaunchComplete]);

  return (
    <div style={{ width: "480px", height: "560px", margin: "0 auto" }}>
      <Canvas
        shadows
        camera={{ position: [8, 8, 14], fov: 40 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#050512"); // very dark blue/black background
        }}
      >
        {/* Scene lights */}
        <ambientLight intensity={0.25} />
        <SpotLight
          position={[12, 20, 10]}
          angle={0.35}
          penumbra={0.9}
          intensity={2.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Ground (subtle) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.2, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#080808" metalness={0.1} roughness={0.9} />
        </mesh>

        <RocketModel launched={launched} onLaunchComplete={onLaunchComplete} />

        {/* Slight orbit controls for a steady view */}
        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

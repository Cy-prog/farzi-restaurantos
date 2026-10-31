import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ShaderDistortionCanvasProps {
  className?: string;
  variant?: 'gold-mist' | 'nitrogen-flow' | 'caustic-ripple';
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;

    vec3 pos = position;

    // Multi-frequency sinusoidal wave displacement (Perlin-like liquid ripples)
    float wave1 = sin(pos.x * 2.5 + uTime * 1.2) * 0.15;
    float wave2 = cos(pos.y * 3.0 + uTime * 0.9) * 0.12;
    float wave3 = sin((pos.x + pos.y) * 4.0 + uTime * 1.5) * 0.08;

    // Pointer dynamic magnetic ripple
    float dist = distance(uv, uMouse);
    float mouseWave = sin(dist * 18.0 - uTime * 3.0) * exp(-dist * 3.5) * 0.25;

    pos.z += wave1 + wave2 + wave3 + mouseWave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColorGold;
  uniform vec3 uColorDark;
  uniform vec3 uColorAccent;

  void main() {
    // Distance from interactive pointer
    float dist = distance(vUv, uMouse);

    // Liquid gold caustics calculation
    float p1 = sin(vUv.x * 12.0 + uTime * 1.4);
    float p2 = cos(vUv.y * 10.0 - uTime * 1.1);
    float caustics = sin((p1 + p2) * 3.0 + uTime) * 0.5 + 0.5;

    // Gradient blend between deep obsidian, burnished gold and cryo vapor
    vec3 color = mix(uColorDark, uColorGold, caustics * 0.65 + vPosition.z * 0.8);

    // Dynamic specular gold sheen
    float specular = pow(max(0.0, dot(vNormal, normalize(vec3(uMouse.x - 0.5, uMouse.y - 0.5, 0.8)))), 16.0);
    color += uColorAccent * specular * 0.7;

    // Soft chromatic edge ripple
    float rippleEdge = smoothstep(0.4, 0.0, dist) * 0.3;
    color += vec3(0.9, 0.75, 0.4) * rippleEdge;

    // Edge falloff vignette
    float edgeAlpha = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x) *
                      smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);

    gl_FragColor = vec4(color, edgeAlpha * 0.85);
  }
`;

export const ShaderDistortionCanvas: React.FC<ShaderDistortionCanvasProps> = ({
  className = '',
  variant = 'gold-mist'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 2.4;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Uniforms
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorGold: { value: new THREE.Color(variant === 'nitrogen-flow' ? '#60A5FA' : '#D4AF37') },
      uColorDark: { value: new THREE.Color('#0A0C10') },
      uColorAccent: { value: new THREE.Color(variant === 'nitrogen-flow' ? '#93C5FD' : '#FFF0D0') }
    };

    // Subdivided High-Density Plane for smooth fluid wave deformation
    const geometry = new THREE.PlaneGeometry(3.2, 2.2, 72, 72);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Interactive Mouse Coordinates with dampening
    let targetMouse = { x: 0.5, y: 0.5 };
    let currentMouse = { x: 0.5, y: 0.5 };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      targetMouse.x = (clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (clientY - rect.top) / rect.height; // Invert for WebGL UV coordinates
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;

      // Spring lerp mouse interaction
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;
      uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);

      // Subtle rotation tilt based on mouse
      mesh.rotation.y = (currentMouse.x - 0.5) * 0.25;
      mesh.rotation.x = -(currentMouse.y - 0.5) * 0.2;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-auto cursor-crosshair ${className}`}
      title="Interactive 3D WebGL Shader Distortion Canvas"
    />
  );
};


import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface MolecularSphereCanvasProps {
  className?: string;
  interactive?: boolean;
}

export const MolecularSphereCanvas: React.FC<MolecularSphereCanvasProps> = ({
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.2);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xd4af37, 3, 20);
    goldPointLight.position.set(4, 3, 4);
    scene.add(goldPointLight);

    const copperPointLight = new THREE.PointLight(0xc57d56, 2.5, 20);
    copperPointLight.position.set(-4, -2, 3);
    scene.add(copperPointLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2);
    rimLight.position.set(0, 5, -3);
    scene.add(rimLight);

    // 3. Central Molecular Spherified Core
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Main Core Sphere (Liquid Glass / Spherified Texture)
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 32);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x12141a,
      emissive: 0x221808,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transmission: 0.3,
      ior: 1.5,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    sphereGroup.add(coreMesh);

    // Outer Wireframe Cage (Precision Molecular Lattice)
    const wireGeometry = new THREE.IcosahedronGeometry(1.35, 2);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    sphereGroup.add(wireMesh);

    // Outer Gold Orbit Rings
    const ringGeometry = new THREE.TorusGeometry(1.85, 0.015, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x332205,
    });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    sphereGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    sphereGroup.add(ring2);

    // 4. Orbiting Spherified Droplets (Pani Puri Caviar / Molecular Beads)
    const dropletCount = 8;
    const droplets: THREE.Mesh[] = [];
    const dropletGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const dropletMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x553311,
    });

    for (let i = 0; i < dropletCount; i++) {
      const drop = new THREE.Mesh(dropletGeom, dropletMat);
      sphereGroup.add(drop);
      droplets.push(drop);
    }

    // 5. Cryogenic Vapor / Spice Embers Particle Field
    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.6 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      particleScales[i] = Math.random();
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe5c358,
      size: 0.04,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sphereGroup.add(particles);

    // 6. Interactive Mouse & Drag Physics
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        sphereGroup.rotation.y += deltaX * 0.008;
        sphereGroup.rotation.x += deltaY * 0.008;
      } else {
        targetRotationY = x * 0.6;
        targetRotationX = -y * 0.6;
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('mousemove', onPointerMove);
      container.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mouseup', onPointerUp);
    }

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous ambient rotation
      sphereGroup.rotation.y += 0.004;
      sphereGroup.rotation.x += 0.002;

      // Smooth interpolation toward mouse target
      if (!isDragging) {
        sphereGroup.rotation.y += (targetRotationY - sphereGroup.rotation.y * 0.1) * 0.05;
        sphereGroup.rotation.x += (targetRotationX - sphereGroup.rotation.x * 0.1) * 0.05;
      }

      // Orbiting rings animation
      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.25;

      // Orbiting droplets path
      droplets.forEach((drop, idx) => {
        const speed = 0.8 + idx * 0.15;
        const angle = elapsedTime * speed + (idx * (Math.PI * 2)) / dropletCount;
        const orbitRadius = 1.6 + Math.sin(elapsedTime * 1.5 + idx) * 0.15;
        drop.position.x = Math.cos(angle) * orbitRadius;
        drop.position.y = Math.sin(angle * 1.2) * (orbitRadius * 0.6);
        drop.position.z = Math.sin(angle) * orbitRadius;
      });

      // Swirling particles
      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

      // Slight pulsating breathing effect on core
      const pulse = 1 + Math.sin(elapsedTime * 2) * 0.03;
      coreMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener('mousemove', onPointerMove);
        container.removeEventListener('mousedown', onPointerDown);
        window.removeEventListener('mouseup', onPointerUp);
      }
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      dropletGeom.dispose();
      dropletMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Interactive 3D Molecular Sphere — Drag to rotate"
    >
      {/* 3D Hint Pill */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] ${
          isHovered ? 'opacity-100' : 'opacity-60'
        }`}
      >
        ✦ 3D Molecular Engine • Drag to Rotate
      </div>
    </div>
  );
};

export default MolecularSphereCanvas;

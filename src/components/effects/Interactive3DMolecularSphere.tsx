import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Interactive3DMolecularSphereProps {
  className?: string;
  size?: number;
}

export const Interactive3DMolecularSphere: React.FC<Interactive3DMolecularSphereProps> = ({
  className = '',
  size = 360
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Core Molecular Sphere with Custom Deform Geometry
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Icosahedron with Wireframe & Core
    const sphereGeo = new THREE.IcosahedronGeometry(1.3, 3);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x161822,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    coreGroup.add(sphereMesh);

    // Outer Gilded Wireframe Cage
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xE5B869,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(sphereGeo, wireMat);
    wireMesh.scale.setScalar(1.04);
    coreGroup.add(wireMesh);

    // Orbital Particle Dust Points
    const particleCount = 220;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.6 + Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xD4AF37,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particleSystem);

    // 3. Theatrical Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xE5B869, 3.5, 12);
    goldPointLight.position.set(3, 3, 3);
    scene.add(goldPointLight);

    const blueRimLight = new THREE.PointLight(0x60A5FA, 2.0, 10);
    blueRimLight.position.set(-3, -2, -2);
    scene.add(blueRimLight);

    // 4. Interactive Drag & Orbit
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.003, y: 0.005 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      coreGroup.rotation.y += deltaX * 0.008;
      coreGroup.rotation.x += deltaY * 0.008;

      rotationVelocity = { x: deltaY * 0.002, y: deltaX * 0.002 };
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 5. Render Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (!isDragging) {
        coreGroup.rotation.y += rotationVelocity.y;
        coreGroup.rotation.x += rotationVelocity.x;
        // Friction dampening
        rotationVelocity.x *= 0.98;
        rotationVelocity.y *= 0.98;
        if (Math.abs(rotationVelocity.y) < 0.003) rotationVelocity.y = 0.003;
      }

      particleSystem.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      wireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      className={`relative inline-block cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Click & Drag to Rotate 3D Molecular Farzi Sphere"
    />
  );
};


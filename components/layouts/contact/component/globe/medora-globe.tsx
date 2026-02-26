'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
});

interface Marker {
  lat: number;
  lng: number;
}

interface MedoraGlobeProps {
  onLocationSelect?: (location: { lat: number; lng: number; name: string }) => void;
  initialLat?: number;
  initialLng?: number;
  className?: string;
  size?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export interface MedoraGlobeRef {
  addPointer: (lat: number, lng: number, locationName: string) => void;
}

const MedoraGlobe = React.forwardRef<MedoraGlobeRef, MedoraGlobeProps>(({
  onLocationSelect,
  initialLat = 20,
  initialLng = 0,
  className = '',
  size = 600,
  autoRotate = true,
  rotationSpeed = 0.5,
}, ref) => {

  const globeRef = useRef<any>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [globeReady, setGlobeReady] = useState(false);

  const FIXED_ALTITUDE = 2;

  useEffect(() => {
    if (globeRef.current && !globeReady) {
      globeRef.current.pointOfView({
        lat: initialLat,
        lng: initialLng,
        altitude: FIXED_ALTITUDE,
      });
      setGlobeReady(true);
    }
  }, [globeReady, initialLat, initialLng]);

  /**
   * THIS FUNCTION IS CALLED FROM CONTACT FORM
   */
  const addPointer = useCallback((lat: number, lng: number) => {
    if (!globeRef.current) return;

    

    // Fly camera to location
    globeRef.current.pointOfView(
      { lat, lng, altitude: FIXED_ALTITUDE },
      1200
    );

    // Add ONE pointer
    setMarkers([{ lat, lng }]);

  }, []);

  React.useImperativeHandle(ref, () => ({
    addPointer,
  }));

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
    >
      {/* @ts-ignore */}
      <Globe
        ref={globeRef}
        width={size}
        height={size}

        globeImageUrl="https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
        bumpImageUrl="https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
        cloudsImageUrl="https://threejs.org/examples/textures/planets/earth_clouds_1024.png"

        backgroundColor="#00000000"

        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        enablePointerInteraction={false}

        autoRotate={autoRotate}
        autoRotateSpeed={rotationSpeed}

        /**
         * POINTER
         * This renders a glowing pointer-like dot
         */
      htmlElementsData={markers}
htmlLat={(d: Marker) => d.lat}
htmlLng={(d: Marker) => d.lng}
htmlElement={() => {
  const el = document.createElement("div");

  el.style.transform = "translate(-50%, -100%)";
  el.style.pointerEvents = "none";

  el.innerHTML = `
    <style>
      @keyframes glassDrop {
        0% { transform: translateY(-30px) scale(0.6); opacity: 0; }
        60% { transform: translateY(4px) scale(1.05); opacity: 1; }
        100% { transform: translateY(0) scale(1); }
      }

      .glass-pin {
        animation: glassDrop 0.45s cubic-bezier(.2,.9,.3,1);
      }
    </style>

    <div class="glass-pin">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        
        <!-- glass body -->
        <path
          d="M12 22C12 22 6.5 16.8 6.5 11.5C6.5 8.18629 9.18629 5.5 12.5 5.5C15.8137 5.5 18.5 8.18629 18.5 11.5C18.5 16.8 12 22 12 22Z"
          fill="rgba(255,255,255,0.35)"
          stroke="rgba(255,255,255,0.8)"
          stroke-width="1.4"
          backdrop-filter="blur(6px)"
        />

        <!-- red core -->
        <circle cx="12.5" cy="11.5" r="3" fill="#ef4444"/>

        <!-- glossy highlight -->
        <ellipse cx="10" cy="9.5" rx="1.2" ry="2" fill="rgba(255,255,255,0.6)"/>
      </svg>
    </div>
  `;

  return el;
}}

        atmosphereColor="rgb(100,180,255)"
        atmosphereAltitude={0.15}

        onGlobeReady={() => setGlobeReady(true)}
      />
    </div>
  );
});

MedoraGlobe.displayName = 'MedoraGlobe';
export default MedoraGlobe;
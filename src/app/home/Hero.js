"use client";

import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import StarBorder from "@/components/ui/star-border";
import LightRays from "@/components/ui/LightRays";
import ShaderBackground from "@/components/ui/ShaderBackground";
import { useState, useEffect } from 'react';
import { motion } from "motion/react";
import { useLoading } from "@/context/LoadingContext";
export default function Hero() {
  const { isLoaded } = useLoading();
  // Use a fixed default to match SSR output; update to actual viewport after mount to avoid hydration mismatches.
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [fadeOutShader, setFadeOutShader] = useState(false);
  const [showRays, setShowRays] = useState(false);

  // Let shader run fully for ~9s, then fade out (without unmount) and bring in rays.
  useEffect(() => {
    const fadeShaderTimer = setTimeout(() => setFadeOutShader(true), 9000); // start fade after full cycles
    const startRaysTimer = setTimeout(() => setShowRays(true), 9000); // bring rays in as shader fades

    return () => {
      clearTimeout(fadeShaderTimer);
      clearTimeout(startRaysTimer);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < 768;

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-[#1e1c1c] overflow-hidden">
      <div className="absolute inset-0 z-0 will-change-transform">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOutShader ? 0 : 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <ShaderBackground
            animationSpeed={0.03}
            backgroundColor="#000000"
            colorIntensity={0.9}
            mosaicScale={{ x: 2, y: 2 }}
            colorA="#e62b1e"
            colorB="#e62b1e"
            width="100%"
            height="100%"
            radius={1.6}
          />
        </motion.div>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1] bg-black/45" />

      {/* Light rays appear after the curtain fades */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: showRays ? (isMobile ? 0.7 : 0.35) : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        {showRays && (
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={isMobile ? 0.7 : 0.5}
            rayLength={isMobile ? 4 : 3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            intensity={isMobile ? 2.2 : 1.0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        )}
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center w-full px-6 h-full mt-10 md:mt-15"
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {isMobile ? (
          /* MOBILE VIEW */
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full text-center scale-90" style={{ marginBottom: "-1rem" }}>
              <TextHoverEffect text="TEDxBMU" key={isLoaded ? "hero-animate" : "hero-idle"} />
            </div>

            <h2 className="text-3xl font-black font-heading uppercase tracking-tight leading-none text-center px-4 mt-2">
              <span className="text-white">THE </span>
              <span className="text-[#EB0028]">UNSEEN </span>
              <span className="text-white">STORIES </span>
            </h2>

            <div className="flex flex-col items-center gap-3 mt-8">
              <div className="flex items-baseline gap-1">
                <span className="text-[#EB0028] text-sm font-black">5</span>
                <span className="text-[#EB0028] text-[9px] font-black">th</span>
                <span className="text-white text-sm font-black ml-1 uppercase">Edition</span>
              </div>
              <div className="w-8 h-[1px] bg-white/20" />
              <div className="flex items-baseline gap-1">
                <span className="text-[#EB0028] text-sm font-black">11</span>
                <span className="text-[#EB0028] text-[9px] font-black">th</span>
                <span className="text-white text-sm font-black ml-1 uppercase text-nowrap">April 2026</span>
              </div>

            </div>
          </div>
        ) : (
          /* DESKTOP VIEW */
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full md:w-[80%] lg:w-[70%] text-center" style={{ marginBottom: "-1.5rem" }}>
              <TextHoverEffect text="TEDxBMU" key={isLoaded ? "hero-animate" : "hero-idle"} />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-heading uppercase tracking-tight leading-none text-center px-4">
              <span className="text-white">THE </span>
              <span className="text-[#EB0028]">UNSEEN </span>
              <span className="text-white">STORIES </span>
            </h2>

            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-6 md:mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-[#EB0028] text-sm md:text-base font-black">5</span>
                <span className="text-[#EB0028] text-[9px] md:text-[10px] font-black">th</span>
                <span className="text-white text-sm md:text-base font-black ml-1">Edition</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <div className="flex items-baseline gap-1">
                <span className="text-[#EB0028] text-sm md:text-base font-black">11</span>
                <span className="text-[#EB0028] text-[9px] md:text-[10px] font-black">th</span>
                <span className="text-white text-sm md:text-base font-black ml-1 text-nowrap">April 2026</span>
              </div>
            </div>



          </div>
        )}
      </motion.div>
    </section>
  );
}
"use client";


  // "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1774531091/3_aoum8l.jpg",

import { useRef, useEffect, useState } from "react";
import GridMotion from "@/components/ui/GridMotion";
import BlurText from "@/components/ui/BlurText";
const galleryImages = [
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597734/DSC00813_zexolq.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597734/DSC00879_jpiyvm.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597733/DSC00979_hb8d9l.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597733/DSC00805_vk37qz.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597733/DSC00850_j68tvv.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597733/DSC00799_ngkhvr.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597733/DSC01051_cmqviw.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597733/DSC01080_vejycs.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597731/DSC00983_zkdib1.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597731/DSC00916_rwvffd.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1782393307/DSC08468_ccdje9.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597731/DSC00998_kpyyz8.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597731/DSC08502_ozed2q.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597730/DSC08154_jj9qv9.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597730/DSC08344_hgbvkb.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597730/DSC08148_dyj2kz.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597729/DSC08129_caqncj.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597729/DSC01149_qqakdq.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597729/DSC01100_qtmhdf.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597729/DSC08602_i40q2j.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597729/DSC08070_elqf42.jpg",
  "https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781597728/DSC08775_przlhr.jpg",
];

const placeholderItems = galleryImages.map((src, i) => (
  <div key={i} className="w-full h-full rounded-xl overflow-hidden">
    <img
      src={src}
      alt={`Gallery ${i + 1}`}
      className="w-full h-full object-cover brightness-110 contrast-105 saturate-110"
      onError={(e) => {
        e.target.parentElement.style.background = `linear-gradient(135deg, rgba(230,43,30,0.${(i % 4) + 1}) 0%, rgba(0,0,0,0.8) 100%)`;
        e.target.style.display = "none";
      }}
    />
  </div>
));
export default function Gallery() {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Auto-slide every 1.5s for mobile view
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % galleryImages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="relative bg-black text-white overflow-hidden">
      {/* Header */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-20 md:pt-24 pb-10 md:pb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8
        transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex flex-col gap-2">
          <span className="text-[#e62b1e] text-[10px] md:text-xs tracking-[0.4em] uppercase font-light mb-2">
            Gallery
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight uppercase">
            <span className="text-[#e62b1e]">THIS</span>{" "}
            <span className="text-white">YEAR'S</span>
            <br />
            <span className="text-white">HIGH</span>
            <span className="text-[#e62b1e]">LIGHTS</span>
          </h2>
        </div>

      </div>

      {/* Gallery Container */}
      <div className="w-full h-[400px] md:h-[600px] relative">
        {/* DESKTOP VIEW - Keep exactly as before */}
        <div className="hidden md:block w-full h-full">
          <GridMotion
            items={placeholderItems}
            gradientColor="rgba(230,43,30,0.4)"
          />
        </div>

        {/* MOBILE VIEW - Auto sliding gallery without scroll-based constraints */}
        <div className="block md:hidden w-full h-[400px] overflow-hidden overflow-x-hidden relative">
          <div 
            className="flex flex-nowrap h-full items-center transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {galleryImages.map((src, i) => (
              <div key={i} className="w-full h-full flex-shrink-0 px-6 py-4 flex items-center justify-center">
                <div className="w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(230,43,30,0.2)] bg-white/5 mx-auto">
                  <img
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover brightness-110 contrast-105 saturate-110"
                    onError={(e) => {
                      e.target.parentElement.style.background = `linear-gradient(135deg, rgba(230,43,30,0.${(i % 4) + 1}) 0%, rgba(0,0,0,0.8) 100%)`;
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </section>
  );
}

"use client";

import { useRef, useEffect, useState } from "react";

export default function Sponsor() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT — Text */}
        <div className={`flex flex-col gap-6 md:gap-8 mt-4 transition-all duration-1000 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight uppercase">
            <span className="text-white">PARTNER</span>
            <br />
            <span className="text-white">WITH </span>
            <span className="text-[#e62b1e]">US</span>
          </h2>

          {/* Description */}
          <p className="text-white/50 text-base leading-relaxed max-w-sm font-light">
            Interested to sponsor us? We are looking for sponsors to help us grow and reach more people.
            If you are interested in sponsoring us, please contact us.
          </p>

          {/* CTA Button */}
          <a
            href="/contact"
            className="inline-flex items-center gap-3 bg-[#e62b1e] hover:bg-[#c0150f] text-white px-8 py-4 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 w-fit
              shadow-[0_0_30px_rgba(230,43,30,0.3)] hover:shadow-[0_0_50px_rgba(230,43,30,0.5)]"
          >
            Let us Know
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

        </div>

        {/* RIGHT — Images */}
        <div className={`grid grid-cols-2 gap-1 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>

          {/* Tall image right */}
          <div className="row-span-2 bg-white/5 rounded-2xl overflow-hidden border border-white/10 h-full min-h-[320px] flex items-center justify-center
            hover:border-[#e62b1e]/30 hover:shadow-[0_0_30px_rgba(230,43,30,0.1)] transition-all duration-500">
              <img src="https://res.cloudinary.com/dhf3vdsqn/image/upload/v1782393773/DSC00993_oceyvb.jpg" alt="Sponsor" className="w-full h-full object-cover" />
          </div>

          {/* Top small */}
          <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 h-52 flex items-center justify-center
            hover:border-[#e62b1e]/30 hover:shadow-[0_0_30px_rgba(230,43,30,0.1)] transition-all duration-500">
              <img src="https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781595784/DSC08148_1_bzetwr.jpg" alt="Sponsor" className="w-full h-full object-cover" />
          </div>

          {/* Bottom small */}
          <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 h-52 flex items-center justify-center
            hover:border-[#e62b1e]/30 hover:shadow-[0_0_30px_rgba(230,43,30,0.1)] transition-all duration-500">
              <img src="https://res.cloudinary.com/dhf3vdsqn/image/upload/v1774531097/16_r7w2gr.jpg" alt="Sponsor" className="w-full h-full object-cover" />
          </div>

        </div>

      </div>

      {/* Red glow */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e62b1e]/5 blur-[120px] rounded-full pointer-events-none" />

    </section>
  );
}
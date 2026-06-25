"use client";

import { useRef, useEffect, useState } from "react";
import BlurText from "@/components/ui/BlurText";
import CountUp from "@/components/ui/CountUp";
import { motion, AnimatePresence } from "motion/react";

function StatBox({ number, suffix, label, start }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-3xl font-black text-white flex items-center">
        <CountUp from={0} to={number} duration={2} startWhen={start} className="text-3xl font-black text-white" />
        {suffix}
      </span>
      <span className="text-white/40 text-xs tracking-widest uppercase">{label}</span>
    </div>
  );
}

const wordData = [
  { text: "Think.",   color: "#e62b1e" },
  { text: "See.",     color: "#ff4444" },
  { text: "Know.",    color: "#c0150f" },
  { text: "Imagine.", color: "#ff6b6b" },
];

export default function Theme() {
  const [visible, setVisible] = useState(false);
  const [statsStarted, setStatsStarted] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const ref = useRef(null);

  // Auto-cycle words every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % wordData.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (visible) setTimeout(() => setStatsStarted(true), 600);
  }, [visible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const currentWord = wordData[wordIndex];

  return (
    <section ref={ref} className="relative bg-black text-white py-24 flex items-center event-section">
      <div className="px-8 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div className={`flex flex-col gap-6 md:gap-8 transition-all duration-1000 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            

              <div className="flex flex-col gap-1 pr-4">
                <BlurText
                  text="Beyond"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight text-white uppercase"
                />
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight flex flex-col gap-0 items-start">
                  <span className="uppercase text-white mb-1">What We</span>

                  {/* Cycling word */}
                  <div className="relative h-[1.1em] min-w-[3ch] flex items-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentWord.text}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        style={{ color: currentWord.color }}
                        className="inline-block uppercase whitespace-nowrap"
                      >
                        {currentWord.text}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-md font-light">
                TEDxBMU 2026 is a space for ideas that challenge what we accept as normal. It brings together voices that question, disrupt, and rethink the way we see the world one idea at a time.
              </p>

              <div className="flex flex-wrap gap-8 md:gap-12 mt-4">
                <StatBox number={6}   suffix="+" label="Speakers"    start={statsStarted} />
                <StatBox number={100} suffix="+" label="Attendees"   start={statsStarted} />
                <StatBox number={1}   suffix=""  label="Day of Ideas" start={statsStarted} />
              </div>
            </div>

            {/* RIGHT — Images */}
            <div className={`grid grid-cols-2 gap-4 transition-all duration-800 delay-200 will-change-transform ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="col-span-1 row-span-2 bg-white/5 rounded-lg overflow-hidden h-80 border border-[#e62b1e]/20 flex items-center justify-center shadow-[0_0_30px_rgba(230,43,30,0.15)] hover:shadow-[0_0_50px_rgba(230,43,30,0.3)] hover:border-[#e62b1e]/40 transition-all duration-400">
                <img src="https://res.cloudinary.com/dhf3vdsqn/image/upload/v1782393147/DSC08775_jlfpxa.jpg" alt="Photo 1" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="bg-white/5 rounded-lg overflow-hidden h-[152px] border border-[#e62b1e]/20 flex items-center justify-center shadow-[0_0_20px_rgba(230,43,30,0.1)] hover:shadow-[0_0_40px_rgba(230,43,30,0.25)] hover:border-[#e62b1e]/40 transition-all duration-400">
                <img src="https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781595090/DSC00884_1_ruzj0s.jpg" alt="Photo 2" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="bg-white/5 rounded-lg overflow-hidden h-[152px] border border-[#e62b1e]/20 flex items-center justify-center shadow-[0_0_20px_rgba(230,43,30,0.1)] hover:shadow-[0_0_40px_rgba(230,43,30,0.25)] hover:border-[#e62b1e]/40 transition-all duration-400">
                <img src="https://res.cloudinary.com/dhf3vdsqn/image/upload/v1781595210/DSC08502_1_yjmxdq.jpg" alt="Photo 3" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// Local styles for performance hints
// content-visibility keeps offscreen layout cheap; intrinsic size avoids jump when revealed
const style = `
.event-section { content-visibility: auto; contain-intrinsic-size: 1200px; }
`;

if (typeof document !== "undefined") {
  const id = "event-section-style";
  if (!document.getElementById(id)) {
    const el = document.createElement("style");
    el.id = id;
    el.textContent = style;
    document.head.appendChild(el);
  }
}
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";

export default function Navbar() {
const [scrolled, setScrolled] = useState(false);
const [hidden, setHidden] = useState(false);
const [lastY, setLastY] = useState(0);
const [isMenuOpen, setIsMenuOpen] = useState(false);

useEffect(() => {
const handleScroll = () => {
const currentY = window.scrollY;
setScrolled(currentY > 50);
setHidden(currentY > lastY && currentY > 100 && !isMenuOpen);
setLastY(currentY);
};
window.addEventListener("scroll", handleScroll, { passive: true });
return () => window.removeEventListener("scroll", handleScroll);
}, [lastY, isMenuOpen]);

return (
<nav
className={`fixed inset-x-0 z-50 backdrop-blur-md transition-all duration-500
        ${
          scrolled
            ? "top-4 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] mx-auto rounded-2xl border border-white/10"
            : "top-0 border-b border-white/5"
        }
        ${hidden ? "-translate-y-[120%]" : "translate-y-0"}
      `}
style={{ background: scrolled ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.3)" }}
>
<div
className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-between transition-all duration-500"
style={{ height: scrolled ? "60px" : "80px" }}
>
{/* Logo */} 
<div className="flex items-center h-full">
  <div className="flex items-center gap-0 leading-none whitespace-nowrap">
    
    <span
      className={`text-[#e62b1e] font-black transition-all duration-500 ${
        scrolled ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
      }`}
    >
      TED
    </span>

    <span
      className={`text-[#e62b1e] font-black relative transition-all duration-500 ${
        scrolled
          ? "text-sm md:text-base -top-1"
          : "text-base md:text-lg -top-1.5"
      }`}
    >
      x
    </span>

    <span
      className={`text-white font-light transition-all duration-500 ${
        scrolled ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
      }`}
    >
      BMU
    </span>

  </div>
</div>

    {/* Mobile Menu Toggle */}
    <button
      className="lg:hidden flex flex-col gap-1.5 z-50"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      <div
        className={`h-0.5 w-6 bg-white transition-all ${
          isMenuOpen ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <div
        className={`h-0.5 w-6 bg-white transition-all ${
          isMenuOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`h-0.5 w-6 bg-white transition-all ${
          isMenuOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </button>

    {/* Links Container */}
    <ul
      className={`
      flex flex-col lg:flex-row items-center gap-6 xl:gap-8
      fixed lg:static top-0 left-0 w-full h-screen lg:h-auto
      bg-black/95 lg:bg-transparent transition-all duration-500
      ${
        isMenuOpen
          ? "translate-x-0 visible opacity-100"
          : "-translate-x-full lg:translate-x-0 invisible lg:visible opacity-0 lg:opacity-100"
      }
      justify-center lg:justify-end
    `}
    >
      <li onClick={() => setIsMenuOpen(false)}>
        <NavLink label="Home" href="/" />
      </li>
      <li onClick={() => setIsMenuOpen(false)}>
        <NavLink label="Events" href="/events" />
      </li>
      <li onClick={() => setIsMenuOpen(false)}>
        <NavLink label="Team" href="/team" />
      </li>
      <li onClick={() => setIsMenuOpen(false)}>
        <NavLink label="About" href="/about" />
      </li>
      <li onClick={() => setIsMenuOpen(false)}>
        <NavLink label="Contact" href="/contact" />
      </li>

    </ul>
  </div>
</nav>


);
}

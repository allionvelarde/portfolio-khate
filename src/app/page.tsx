"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaFigma, 
  FaReact 
} from "react-icons/fa";
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss
} from "react-icons/si";
import { 
  Mail, 
  Sparkles, 
  Heart, 
  Layers, 
  Code2, 
  Activity, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Briefcase,
  Palette,
  PenTool
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- GIRLY HARMONIC WEB AUDIO SFX ---
function useGirlyUISounds(soundEnabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playSound = useCallback((type: "hover" | "click" | "tab") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "hover") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.05);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.09);
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === "tab") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.07);
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch {
      // Audio fallback handling
    }
  }, [soundEnabled]);

  return playSound;
}

// --- 3D INTERACTIVE GLOBE / EARTH MESH ---
function GlowingGirlyCoreMesh({ wireframe }: { wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3 + (state.pointer.x * 0.02);
      groupRef.current.rotation.x += delta * 0.1 + (state.pointer.y * 0.02);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={1.25}>
      {/* MAIN GLOBE SPHERE */}
      <mesh>
        <sphereGeometry args={[0.75, 24, 24]} />
        <meshStandardMaterial
          color={wireframe ? "#f43f5e" : "#fb7185"}
          wireframe={wireframe}
          emissive="#fb7185"
          emissiveIntensity={wireframe ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* EQUATORIAL ORBIT RING */}
      <group ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.15, 0.025, 16, 64]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#fda4af"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"overview" | "design" | "snippets">("overview");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manilaTime, setManilaTime] = useState("");

  const playSound = useGirlyUISounds(soundEnabled);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setManilaTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyEmailToClipboard = () => {
    playSound("click");
    navigator.clipboard.writeText("khate.villalon@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleTabChange = (tab: "overview" | "design" | "snippets") => {
    playSound("tab");
    setActiveTab(tab);
  };

  const stack = [
    { name: "Figma", icon: FaFigma, category: "UI/UX & Systems" },
    { name: "React / Next.js", icon: FaReact, category: "Frontend Web" },
    { name: "TypeScript", icon: SiTypescript, category: "Logic & Code" },
    { name: "Tailwind CSS", icon: SiTailwindcss, category: "Styling & Layout" },
    { name: "UI Design", icon: PenTool, category: "Digital Visuals" },
    { name: "Branding", icon: Palette, category: "Vector & Identity" },
  ];

  const doubleStack = [...stack, ...stack];

 const experiences = [
    {
      company: "PUP Santa Rosa — BSIT Section",
      role: "Publication & Creatives Lead",
      type: "Academic Role",
      period: "2026 — Present",
      location: "Santa Rosa, Laguna",
      description:
        "Directing visual design assets, section announcements, and branding systems for student publications and academic course presentations.",
      skills: ["Figma", "Visual Identity", "Canva", "Layout Systems"],
    },
    {
      company: "College Academic Group",
      role: "Lead UI/UX & Documentation",
      type: "Student Project",
      period: "2025 — 2026",
      location: "PUP Santa Rosa",
      description:
        "Designed interactive user flows, wireframes, and presentation slides for business communication and IT case study defenses.",
      skills: ["Figma", "User Research", "Documentation", "Pitch Decks"],
    },
  ];

  const projects = [
    {
      title: "ClassHub Student Portal",
      badge: "Academic Web App",
      description:
        "A full-stack section portal designed to manage assignment deadlines, class schedules, and Discord-style student discussion forums.",
      tech: ["Next.js", "React", "Tailwind CSS", "Firebase"],
      github: "https://github.com",
      live: "https://vercel.com",
      metrics: "Real-time task tracking for BSIT section",
    },
    {
      title: "Business Case Study UI",
      badge: "Case Study & Prototype",
      description:
        "Interactive high-fidelity prototype and pitch deck designed for a business communication micro case study presentation.",
      tech: ["Figma", "UI/UX", "Prototyping"],
      github: "https://github.com",
      live: "https://vercel.com",
      metrics: "High-contrast editorial slide layout",
    },
    {
      title: "IT Fundamentals Notes Hub",
      badge: "Resource Hub",
      description:
        "A organized web repository storing section lecture summaries, coding cheat sheets, and reviewer materials for IT majors.",
      tech: ["React", "Tailwind CSS", "Markdown"],
      github: "https://github.com",
      live: "https://vercel.com",
      metrics: "Accessible study resources for classmates",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdf8f9] text-rose-950 font-sans selection:bg-rose-200 selection:text-rose-900 relative overflow-x-hidden">
      
      {/* SOFT GLOWING PINK AND PASTEL ORBS */}
      <div className="fixed top-[-10%] left-[15%] w-[500px] h-[500px] bg-rose-200/50 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[160px] pointer-events-none" />

      {/* LIGHT GRID */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.25] z-0" 
        style={{
          backgroundImage: `linear-gradient(#fda4af 1px, transparent 1px), linear-gradient(90deg, #fda4af 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />

      {/* TOP SYSTEM STATUS BAR */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-rose-100 px-4 py-2 text-xs font-mono flex flex-wrap justify-between items-center z-50 relative text-rose-700">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_#fb7185]" />
            ONLINE & CREATING
          </span>
          <span className="text-rose-200">|</span>
          <span className="text-rose-400">MANILA (GMT+8)</span>
          <span className="text-rose-200 hidden sm:inline">|</span>
          <span className="text-rose-400 hidden sm:inline">PHT: {manilaTime || "00:00:00"}</span>
        </div>

        <div className="flex items-center gap-4 text-rose-600">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound("click");
            }}
            onMouseEnter={() => playSound("hover")}
            className="flex items-center gap-1 hover:text-rose-900 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 size={13} className="text-rose-500" /> : <VolumeX size={13} />}
            <span>SFX: {soundEnabled ? "ON" : "OFF"}</span>
          </button>
          <span className="text-rose-200">|</span>
          <button 
            onClick={copyEmailToClipboard}
            onMouseEnter={() => playSound("hover")}
            className="hover:text-rose-900 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedEmail ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copiedEmail ? "COPIED!" : "khate.villalon@gmail.com"}</span>
          </button>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-rose-900 transition-colors">
            <FaInstagram size={14} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-rose-900 transition-colors">
            <FaLinkedin size={14} />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-rose-900 transition-colors">
            <FaGithub size={14} />
          </a>
        </div>
      </div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-500 shadow-sm">
              <Heart size={18} className="fill-rose-400/30 text-rose-500" />
            </div>
            <div>
              <h1 className="text-base font-bold text-rose-950 tracking-tight leading-none flex items-center gap-2">
                Khate Villalon
                <Sparkles size={14} className="text-rose-400" />
              </h1>
              <p className="text-[11px] font-mono text-rose-400 mt-1">
                UI/UX Designer & Creative Developer
              </p>
            </div>
          </div>

          {/* TAB SYSTEM */}
          <div className="flex items-center gap-1 bg-rose-50/80 p-1 border border-rose-100 rounded-xl font-mono text-xs">
            {(["overview", "design", "snippets"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                onMouseEnter={() => playSound("hover")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-rose-600 border border-rose-200 font-semibold shadow-sm"
                    : "text-rose-400 hover:text-rose-800"
                }`}
              >
                /{tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10 space-y-10">
        
        {/* HERO SECTION */}
        <section className="grid md:grid-cols-12 gap-6 items-stretch">
          
          {/* PROFILE CARD */}
          <div className="md:col-span-7 bg-white/90 border border-rose-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-rose-100/50 backdrop-blur-sm group">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-mono text-xs">
                <Activity size={13} className="text-rose-500 animate-pulse" />
                <span>Available for UI/UX & Creative Projects</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-rose-950 tracking-tight leading-snug">
                Crafting elegant digital experiences, user interfaces, & brand aesthetic.
              </h2>

              <p className="text-sm text-rose-700/80 leading-relaxed">
                Specializing in intuitive web designs and interactive frontends. Merging visual beauty with functional layout systems using 
                <span className="text-rose-950 font-semibold"> Figma, React, Next.js, & Tailwind CSS</span>.
              </p>
            </div>

            <div className="pt-6 border-t border-rose-100 flex flex-wrap items-center gap-3 mt-6">
              <a
                href="#projects-list"
                onClick={() => playSound("click")}
                onMouseEnter={() => playSound("hover")}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-rose-200 hover:scale-105 active:scale-95"
              >
                View Works <ExternalLink size={14} />
              </a>
              <button
                onClick={copyEmailToClipboard}
                onMouseEnter={() => playSound("hover")}
                className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-medium text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Mail size={14} />
                {copiedEmail ? "Email Copied!" : "Get in Touch"}
              </button>
            </div>
          </div>

          {/* 3D CANVAS VIEWPORT */}
          <div className="md:col-span-5 bg-white/90 border border-rose-100 rounded-3xl p-4 flex flex-col justify-between relative min-h-[300px] shadow-xl shadow-rose-100/50 backdrop-blur-sm hover:border-rose-200 transition-colors">
            <div className="flex justify-between items-center text-xs font-mono text-rose-400 pb-2 border-b border-rose-100">
              <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                <Layers size={13} className="text-rose-500" />
                3D Interactive Globe Viewport
              </span>
              <button
                onClick={() => {
                  playSound("click");
                  setWireframeMode(!wireframeMode);
                }}
                onMouseEnter={() => playSound("hover")}
                className="text-[11px] bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-lg text-rose-600 border border-rose-200 transition-colors cursor-pointer"
              >
                Render: {wireframeMode ? "Globe Grid" : "Glow Solid"}
              </button>
            </div>

            {/* THREE.JS CANVAS */}
            <div className="w-full h-[210px] relative my-auto cursor-grab active:cursor-grabbing">
              <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[5, 5, 5]} intensity={1.5} color="#fb7185" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#f43f5e" />
                <GlowingGirlyCoreMesh wireframe={wireframeMode} />
              </Canvas>
            </div>

            <div className="text-[11px] font-mono text-rose-400 text-center pt-2 border-t border-rose-100 flex justify-between px-1">
              <span>Interactive 3D Engine</span>
              <span className="text-rose-500 font-semibold">FPS: ~60</span>
            </div>
          </div>
        </section>

        {/* DYNAMIC TAB SECTIONS */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.section
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* INFINITE SCROLLING TECH STACK */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono text-rose-600 uppercase tracking-wider flex items-center gap-2 font-semibold">
                    <Palette size={14} /> Design & Creative Stack
                  </h3>
                  <span className="text-[10px] font-mono text-rose-300">Hover to pause</span>
                </div>

                {/* SCROLL CONTAINER WITH GRADIENT MASK */}
                <div className="relative w-full overflow-hidden rounded-2xl border border-rose-100 bg-white/80 p-3 group shadow-sm">
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                  <motion.div
                    className="flex items-center gap-4 w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 18,
                        ease: "linear",
                      },
                    }}
                    style={{ willChange: "transform" }}
                  >
                    {doubleStack.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => playSound("hover")}
                          className="bg-rose-50/50 border border-rose-100 hover:border-rose-300 px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-rose-100 shrink-0 cursor-pointer"
                        >
                          <div className="p-2 bg-white rounded-lg text-rose-500 shadow-sm">
                            <Icon size={20} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-rose-950 whitespace-nowrap">{item.name}</div>
                            <div className="text-[10px] text-rose-400 font-mono whitespace-nowrap">{item.category}</div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>

              {/* WORK EXPERIENCE SECTION */}
              <div className="space-y-4">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-xs font-mono text-rose-600 uppercase tracking-wider flex items-center gap-2 font-semibold">
                    <Briefcase size={14} /> Experience & Creative Roles
                  </h3>
                  <span className="text-xs font-mono text-rose-400">2 Verified Roles</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {experiences.map((exp, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => playSound("hover")}
                      className="bg-white/90 border border-rose-100 rounded-3xl p-5 flex flex-col justify-between gap-4 hover:border-rose-200 transition-all shadow-md shadow-rose-100/40 group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-semibold inline-block mb-1">
                              {exp.type}
                            </span>
                            <h4 className="text-base font-bold text-rose-950 group-hover:text-rose-600 transition-colors">
                              {exp.role}
                            </h4>
                            <div className="text-xs text-rose-500 font-medium">{exp.company}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 block">
                              {exp.period}
                            </span>
                            <span className="text-[10px] font-mono text-rose-300 mt-1 block">
                              {exp.location}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-rose-700/80 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-rose-100 flex flex-wrap gap-1.5">
                        {exp.skills.map((skill, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-rose-50/80 rounded-md text-rose-600 border border-rose-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* PROJECTS */}
              <div id="projects-list">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-xs font-mono text-rose-600 uppercase tracking-wider flex items-center gap-2 font-semibold">
                    <Sparkles size={14} /> Selected Creative Projects
                  </h3>
                  <span className="text-xs font-mono text-rose-400">3 Featured Case Studies</span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {projects.map((proj, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => playSound("hover")}
                      className="bg-white/90 border border-rose-100 rounded-3xl p-5 flex flex-col justify-between gap-4 hover:border-rose-200 transition-all shadow-md shadow-rose-100/40 group"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-semibold inline-block">
                          {proj.badge}
                        </span>
                        <h4 className="text-base font-bold text-rose-950 group-hover:text-rose-600 transition-colors">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-rose-700/80 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-rose-100">
                        <div className="text-[10px] font-mono text-rose-500">
                          <span className="text-rose-400">Highlight: </span>{proj.metrics}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {proj.tech.map((t, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-rose-50/80 rounded-md text-rose-600 border border-rose-100">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                          <a 
                            href={proj.github} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={() => playSound("click")}
                            className="text-rose-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                          >
                            <FaGithub size={12} /> Source
                          </a>
                          <a 
                            href={proj.live} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={() => playSound("click")}
                            className="text-rose-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink size={12} /> Live Preview
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === "design" && (
            <motion.section
              key="design"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/90 border border-rose-100 rounded-3xl p-6 space-y-6 shadow-md shadow-rose-100/40"
            >
              <h3 className="text-sm font-mono text-rose-600 uppercase tracking-wider flex items-center gap-2 font-semibold">
                <Palette size={16} /> Design Philosophy & Aesthetics
              </h3>

              <div className="grid md:grid-cols-2 gap-6 text-xs text-rose-800 leading-relaxed">
                <div className="space-y-2 bg-rose-50/60 p-4 rounded-2xl border border-rose-100 hover:border-rose-200 transition-colors">
                  <div className="font-bold text-rose-950 flex items-center gap-2 text-sm">
                    <Heart size={15} className="text-rose-500 fill-rose-300/40" /> User-Centric Micro-Interactions
                  </div>
                  <p className="text-rose-700/80">
                    Prioritizing intuitive user journeys with playful micro-animations, clear typography hierarchy, and effortless component navigation.
                  </p>
                </div>

                <div className="space-y-2 bg-rose-50/60 p-4 rounded-2xl border border-rose-100 hover:border-rose-200 transition-colors">
                  <div className="font-bold text-rose-950 flex items-center gap-2 text-sm">
                    <Sparkles size={15} className="text-rose-500" /> Cohesive Brand Systems
                  </div>
                  <p className="text-rose-700/80">
                    Creating harmonized color palettes, reusable component libraries in Figma, and seamless design-to-code implementations.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === "snippets" && (
            <motion.section
              key="snippets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-rose-100 rounded-3xl p-5 font-mono text-xs overflow-x-auto shadow-xl shadow-rose-100/50"
            >
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-rose-100 text-rose-400">
                <span>// DesignTokens.ts</span>
                <span>Theme Config</span>
              </div>
              <pre className="text-rose-600 leading-relaxed">
                <code>{`export const themeConfig = {
  palette: {
    primary: "#f43f5e",   // Rose 500
    accent: "#fb7185",    // Rose 400
    background: "#fdf8f9",
    cardBackground: "#ffffff",
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    accentMono: "JetBrains Mono, monospace",
  },
  animations: {
    springDamping: 25,
    stiffness: 120,
  }
};`}</code>
              </pre>
            </motion.section>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <footer className="pt-8 border-t border-rose-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-rose-400">
          <p>© {new Date().getFullYear()} Khate Villalon. Built with Next.js, React, & Three.js.</p>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-rose-600 transition-colors">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-rose-600 transition-colors">LinkedIn</a>
            <button onClick={copyEmailToClipboard} className="hover:text-rose-600 transition-colors cursor-pointer">Email</button>
          </div>
        </footer>

      </main>
    </div>
  );
}
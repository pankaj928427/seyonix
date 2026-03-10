import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ceoImage from "./assets/ceo.jpeg";

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Legacy","Visionary","Kingdom","Power","Authority","Alliance"];

const STATS = [
  { number: "2024", label: "Year Founded" },
  { number: "3+",   label: "Royal Products" },
  { number: "∞",    label: "Vision Horizon" },
  { number: "99.998%", label: "Ethical AI" },
];

const TIMELINE = [
  { year: "2024 · Genesis",      title: "The Empire is Founded by Pankaj Sharma ", desc: "Seyonix Groups emerges from Pune, Maharashtra, India — a deep-tech product based company built on the belief that technology can crown an era." },
  { year: "2024 · First Conquests", title: "Royal Products Launched", desc: "EternaLegacy AI, Zynext, and Artzone enter the market — three pillars of the Seyonix product kingdom." },
  { year: "2025 · Expansion",    title: "Global Influence Grows",      desc: "Strategic partnerships forged. Ethical AI frameworks adopted. The empire begins its global chapter." },
  { year: "The Future · Eternal",title: "Legacy Secured",              desc: "A billion-dollar deep-tech dynasty in the making — building the digital empires of tomorrow." },
];

const PRODUCTS = [
  {
    num:"I",
    icon:"👑",
    crown:"The Memory Throne",
    name:"EternaLegacy AI",
    desc:"An AI-powered digital legacy platform that preserves what matters most — memories, wisdom, and the essence of a life lived. Built for eternity, coming soon.....",
    link:"https://eternalegacy.ai"
  },
  {
    num:"II",
    icon:"🏰",
    crown:"The Digital Fortress",
    name:"zynext.in",
    desc:"A smart, scalable digital ecosystem engineered for growth at speed. The fortress from which the next generation of digital ventures is born. live now",
    link:"https://zynext.in/"
  },
  {
    num:"III",
    icon:"🎨",
    crown:"The Creative Crown",
    name:"Artzone",
    desc:"A global marketplace where creativity commands royalty. Connecting visionary artists with collectors who appreciate true mastery. underdevelopemt",
    link:"https://artzone3602.netlify.app/"
  }
];

const TECH = [
  { icon:"🧠", name:"Artificial Intelligence", pct:80, desc:"Proprietary AI models trained on ethical frameworks. Intelligent systems that learn, adapt, and lead." },
  { icon:"☁️", name:"Cloud Architecture",      pct:70, desc:"Enterprise-grade cloud infrastructure built for speed, resilience, and infinite scalability." },
  { icon:"🔐", name:"Royal Security",          pct:90, desc:"Military-grade encryption and zero-trust architecture protecting every node of the empire." },
  { icon:"⚡", name:"Scalability",             pct:75, desc:"Systems architected to handle millions without compromise. Built to rule at scale." },
  { icon:"⚖️", name:"Ethical AI",              pct:85, desc:"Technology with a conscience. Fair, transparent, and built to serve humanity — not control it." },
  { icon:"📊", name:"Data Intelligence",       pct:80, desc:"Turning raw information into strategic gold. Every data point serves the empire's ambitions." },
];

const WHY = [
  { icon:"💡", title:"Innovation Authority", desc:"We don't follow trends. We create them. Every product is a new standard the industry must aspire to meet." },
  { icon:"💎", title:"Elite Quality",        desc:"Crafted with the precision of a Swiss watch and the durability of Indian steel. Excellence is non-negotiable." },
  { icon:"🛡️", title:"Royal Trust",          desc:"Every partnership is a covenant. Every product is a promise. We have never broken either." },
  { icon:"⚖️", title:"Ethical Power",        desc:"True power is responsible power. Our AI is fair, transparent, and built to serve humanity." },
  { icon:"🌍", title:"Global Reach",         desc:"Our products speak every language, serve every market, and solve universal problems at planetary scale." },
  { icon:"🇮🇳", title:"Indian Pride",         desc:"Born in Bharat, built for the world. Carrying the legacy of one of history's greatest civilizations into the digital age." },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function useCounter(target, inView, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || isNaN(parseInt(target))) return;
    const end = parseInt(target);
    const step = end / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, end);
      setCount(Math.floor(cur));
      if (cur >= end) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return isNaN(parseInt(target)) ? target : count + (target.includes("+") ? "+" : target.includes("%") ? "%" : "");
}

// ─── PARTICLES ───────────────────────────────────────────────────────────────
function Particles() {
  const particles = useRef(Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 12,
  }))).current;
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position:"absolute",
          left:`${p.left}%`,
          bottom:"-10px",
          width:`${p.size}px`,
          height:`${p.size}px`,
          borderRadius:"50%",
          background:"radial-gradient(circle, #D4AF37 0%, transparent 70%)",
          animation:`particleFloat ${p.duration}s ${p.delay}s linear infinite`,
          opacity:0,
        }} />
      ))}
    </div>
  );
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x:0, y:0 });
  const ring_pos = useRef({ x:0, y:0 });
  useEffect(() => {
    const move = e => { pos.current = { x: e.clientX, y: e.clientY }; if(dot.current) { dot.current.style.left=e.clientX+"px"; dot.current.style.top=e.clientY+"px"; } };
    document.addEventListener("mousemove", move);
    let raf;
    const animate = () => {
      ring_pos.current.x += (pos.current.x - ring_pos.current.x) * 0.12;
      ring_pos.current.y += (pos.current.y - ring_pos.current.y) * 0.12;
      if (ring.current) { ring.current.style.left=ring_pos.current.x+"px"; ring.current.style.top=ring_pos.current.y+"px"; }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={dot} style={{ position:"fixed", width:10, height:10, background:"#D4AF37", borderRadius:"50%", pointerEvents:"none", zIndex:99999, transform:"translate(-50%,-50%)", mixBlendMode:"screen", transition:"width .3s,height .3s" }} />
      <div ref={ring} style={{ position:"fixed", width:36, height:36, border:"1px solid rgba(212,175,55,0.5)", borderRadius:"50%", pointerEvents:"none", zIndex:99998, transform:"translate(-50%,-50%)" }} />
    </>
  );
}

// ─── LOADER ───────────────────────────────────────────────────────────────────
function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(t); setTimeout(() => { setDone(true); setTimeout(onDone, 600); }, 300); return 100; } return p + 2; }), 30);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:"#080808", zIndex:99999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", transition:"opacity .8s, visibility .8s", opacity: done?0:1, visibility: done?"hidden":"visible" }}>
      <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"2.2rem", fontWeight:900, background:"linear-gradient(135deg,#D4AF37,#E6C87A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:40, letterSpacing:"0.12em", animation:"glowPulse 2s ease-in-out infinite" }}>SEYONIX</div>
      <div style={{ width:220, height:1, background:"rgba(212,175,55,0.12)", overflow:"hidden", position:"relative" }}>
        <div style={{ height:"100%", background:"linear-gradient(to right,#D4AF37,#E6C87A)", width:`${pct}%`, transition:"width .05s linear", boxShadow:"0 0 12px rgba(212,175,55,0.8)" }} />
      </div>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.5em", color:"#D4AF37", textTransform:"uppercase", marginTop:18 }}>
        Initializing the Empire · {pct}%
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ scrolled, activeSection }) {
  const scrollTo = id => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior:"smooth" }); };
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"space-between", padding: scrolled ? "14px 60px" : "22px 60px", background: scrolled ? "rgba(5,11,26,0.97)" : "linear-gradient(to bottom,rgba(8,8,8,0.9),transparent)", borderBottom: scrolled ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(212,175,55,0.04)", backdropFilter:"blur(12px)", transition:"all .4s" }}>
      <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"1.2rem", fontWeight:700, background:"linear-gradient(135deg,#D4AF37,#E6C87A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.1em", cursor:"pointer" }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>SEYONIX</div>
      <ul style={{ display:"flex", gap:36, listStyle:"none", margin:0, padding:0 }}>
        {NAV_LINKS.map(l => (
          <li key={l}>
            <button onClick={() => scrollTo(l)} style={{ background:"none", border:"none", fontFamily:"'Cinzel',serif", fontSize:"0.65rem", letterSpacing:"0.22em", color: activeSection===l.toLowerCase() ? "#D4AF37" : "#C9CCD6", textTransform:"uppercase", cursor:"pointer", transition:"color .3s", padding:"4px 0", borderBottom: activeSection===l.toLowerCase() ? "1px solid #D4AF37" : "1px solid transparent" }}>{l}</button>
          </li>
        ))}
      </ul>
      <button onClick={() => scrollTo("Alliance")} style={{ padding:"10px 26px", border:"1px solid rgba(212,175,55,0.45)", background:"rgba(212,175,55,0.1)", color:"#E6C87A", fontFamily:"'Cinzel',serif", fontSize:"0.62rem", letterSpacing:"0.22em", textTransform:"uppercase", cursor:"pointer", transition:"all .3s", backdropFilter:"blur(4px)" }}
        onMouseEnter={e => { e.target.style.background="rgba(212,175,55,0.22)"; e.target.style.boxShadow="0 0 24px rgba(212,175,55,0.3)"; e.target.style.color="#D4AF37"; }}
        onMouseLeave={e => { e.target.style.background="rgba(212,175,55,0.1)"; e.target.style.boxShadow="none"; e.target.style.color="#E6C87A"; }}>
        Enter the Empire
      </button>
    </nav>
  );
}

// ─── GOLD DIVIDER ─────────────────────────────────────────────────────────────
const GoldDivider = ({ label }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, padding:"28px 60px", background:"transparent" }}>
    <div style={{ flex:1, maxWidth:220, height:1, background:"linear-gradient(to right,transparent,rgba(212,175,55,0.35))" }} />
    <span style={{ fontFamily:"'Cinzel',serif", fontSize:"0.52rem", letterSpacing:"0.55em", color:"#D4AF37", textTransform:"uppercase", whiteSpace:"nowrap" }}>◆ {label} ◆</span>
    <div style={{ flex:1, maxWidth:220, height:1, background:"linear-gradient(to left,transparent,rgba(212,175,55,0.35))" }} />
  </div>
);

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
const SectionHeader = ({ label, title, sub, center, inView }) => (
  <div style={{ textAlign: center?"center":"left", opacity: inView?1:0, transform: inView?"translateY(0)":"translateY(40px)", transition:"all .9s cubic-bezier(.16,1,.3,1)" }}>
    <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.5em", color:"#D4AF37", textTransform:"uppercase", marginBottom:14, display:"flex", alignItems:"center", gap:10, justifyContent: center?"center":"flex-start" }}>
      <span style={{ fontSize:"0.4rem" }}>◆</span>{label}
    </div>
    <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:700, lineHeight:1.15, background:"linear-gradient(135deg,#FAF9F6,#E6C87A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:18 }}>{title}</h2>
    <div style={{ width:70, height:2, background:"linear-gradient(to right,#D4AF37,transparent)", margin: center?"0 auto 20px":"0 0 20px" }} />
    {sub && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontWeight:300, fontStyle:"italic", color:"#C9CCD6", maxWidth:520, lineHeight:1.7, margin: center?"0 auto":"0" }}>{sub}</p>}
  </div>
);

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const scrollY = useRef(0);
  const wmRef = useRef(null);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; if(wmRef.current) wmRef.current.style.transform=`translateY(${window.scrollY*.3}px)`; };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  return (
    <section id="legacy" style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", background:"radial-gradient(ellipse at 50% 0%,#0d1a3a 0%,#050B1A 40%,#080808 100%)" }}>
      {/* Watermark */}
      <div ref={wmRef} style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(80px,18vw,220px)", fontWeight:900, color:"rgba(212,175,55,0.042)", letterSpacing:"0.05em", pointerEvents:"none", userSelect:"none", whiteSpace:"nowrap" }}>SEYONIX</div>
      {/* Light rays */}
      <div style={{ position:"absolute", top:"-20%", left:"50%", transform:"translateX(-50%)", width:"100%", height:"60%", background:"conic-gradient(from 260deg at 50% 0%,transparent 0deg,rgba(212,175,55,0.03) 15deg,transparent 30deg,rgba(30,58,138,0.04) 45deg,transparent 60deg,rgba(212,175,55,0.02) 75deg,transparent 90deg)", pointerEvents:"none", animation:"rayRotate 20s linear infinite" }} />
      <Particles />
      {/* Content */}
      <div
  style={{
    position:"relative",
    zIndex:10,
    textAlign:"center",
    padding:"0 24px",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    maxWidth:"1280px",
    margin:"0 auto",
    width:"100%"
  }}
>
        <div style={{ display:"inline-flex", alignItems:"center", gap:10, border:"1px solid rgba(212,175,55,0.4)", padding:"8px 24px", marginBottom:40, fontFamily:"'Cinzel',serif", fontSize:"0.62rem", letterSpacing:"0.35em", color:"#D4AF37", textTransform:"uppercase", background:"rgba(212,175,55,0.08)", opacity:loaded?1:0, transform:loaded?"translateY(0)":"translateY(30px)", transition:"all 1.2s .2s cubic-bezier(.16,1,.3,1)" }}>
          <span style={{fontSize:"0.35rem"}}>◆</span> Est. 2024 · Pune, India · Deep Technology <span style={{fontSize:"0.35rem"}}>◆</span>
        </div>
        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(2.6rem,7vw,6.5rem)", fontWeight:900, lineHeight:1.05, background:"linear-gradient(160deg,#FAF9F6 0%,#E6C87A 40%,#D4AF37 60%,#FAF9F6 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.02em", filter:"drop-shadow(0 0 40px rgba(212,175,55,0.2))", opacity:loaded?1:0, transform:loaded?"translateY(0)":"translateY(50px)", transition:"all 1.2s .4s cubic-bezier(.16,1,.3,1)", marginBottom:0 }}>
          Engineering Legacy.<br/>Building Empires.
        </h1>
        <div style={{ display:"flex", alignItems:"center", gap:16, margin:"28px 0", opacity:loaded?1:0, transition:"opacity 1.2s .6s" }}>
          <div style={{ width:60, height:1, background:"linear-gradient(to right,transparent,#D4AF37)" }} />
          <span style={{ color:"#D4AF37", fontSize:"0.7rem" }}>◆◆◆</span>
          <div style={{ width:60, height:1, background:"linear-gradient(to left,transparent,#D4AF37)" }} />
        </div>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1rem,2.5vw,1.5rem)", fontWeight:300, fontStyle:"italic", color:"#C9CCD6", letterSpacing:"0.06em", maxWidth:680, margin:"0 0 48px", lineHeight:1.65, opacity:loaded?1:0, transform:loaded?"translateY(0)":"translateY(30px)", transition:"all 1.2s .8s cubic-bezier(.16,1,.3,1)" }}>
          Seyonix Groups — Where Deep Technology Meets Royal Vision
        </p>
        <div style={{ display:"flex", gap:18, flexWrap:"wrap", justifyContent:"center", opacity:loaded?1:0, transition:"opacity 1.2s 1s" }}>
          <RoyalButton onClick={() => scrollTo("kingdom")}>Our Kingdom</RoyalButton>
          <GhostButton onClick={() => scrollTo("alliance")}>Partner With Us</GhostButton>
        </div>
      </div>
      {/* Scroll indicator */}
      <div style={{ position:"absolute", bottom:40, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, opacity:loaded?.55:0, transition:"opacity 1.5s 1.4s" }}>
        <span style={{ fontFamily:"'Cinzel',serif", fontSize:"0.52rem", letterSpacing:"0.35em", color:"#D4AF37", textTransform:"uppercase" }}>Descend</span>
        <div style={{ width:1, height:50, background:"linear-gradient(to bottom,#D4AF37,transparent)", animation:"scrollPulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

// ─── BUTTONS ─────────────────────────────────────────────────────────────────
function RoyalButton({ children, onClick, style={} }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ padding:"15px 42px", border:`1px solid ${hover?"#D4AF37":"rgba(212,175,55,0.45)"}`, background: hover?"rgba(212,175,55,0.2)":"rgba(212,175,55,0.1)", color: hover?"#D4AF37":"#E6C87A", fontFamily:"'Cinzel',serif", fontSize:"0.7rem", letterSpacing:"0.25em", textTransform:"uppercase", cursor:"pointer", transition:"all .4s", boxShadow: hover?"0 0 30px rgba(212,175,55,0.25)":"none", transform: hover?"translateY(-2px)":"translateY(0)", backdropFilter:"blur(8px)", ...style }}>
      {children}
    </button>
  );
}
function GhostButton({ children, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ padding:"15px 42px", border:`1px solid ${hover?"#C9CCD6":"rgba(201,204,214,0.3)"}`, background:"transparent", color: hover?"#FAF9F6":"#C9CCD6", fontFamily:"'Cinzel',serif", fontSize:"0.7rem", letterSpacing:"0.25em", textTransform:"uppercase", cursor:"pointer", transition:"all .4s", transform: hover?"translateY(-2px)":"translateY(0)" }}>
      {children}
    </button>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About() {
  const [hRef, inView] = useInView();
  const [sRef, statsIn] = useInView();
  return (
    <section id="legacy-section" style={{ padding:"110px 60px", background:"linear-gradient(160deg,#080808 0%,#050B1A 50%,#080808 100%)", position:"relative" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div ref={hRef}><SectionHeader inView={inView} label="Since the Beginning" title="The Seyonix Legacy" sub="A story of ambition forged in code, vision cast in steel, and excellence measured in decades yet to come." /></div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:90, marginTop:72, alignItems:"start" }}>
          {/* Timeline */}
          <div style={{ position:"relative", paddingLeft:28, opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(50px)", transition:"all .9s .2s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:1, background:"linear-gradient(to bottom,#D4AF37,transparent)" }} />
            {TIMELINE.map((t,i) => (
              <div key={i} style={{ position:"relative", paddingLeft:28, paddingBottom:44 }}>
                <div style={{ position:"absolute", left:-4, top:6, width:9, height:9, background:"#D4AF37", borderRadius:"50%", boxShadow:"0 0 12px rgba(212,175,55,0.5)" }} />
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.65rem", letterSpacing:"0.3em", color:"#D4AF37", marginBottom:8 }}>{t.year}</div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:"1.05rem", fontWeight:600, color:"#FAF9F6", marginBottom:8 }}>{t.title}</div>
                <div style={{ fontSize:"0.88rem", color:"#C9CCD6", lineHeight:1.7 }}>{t.desc}</div>
              </div>
            ))}
          </div>
          {/* Stats */}
          <div ref={sRef} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, opacity:statsIn?1:0, transform:statsIn?"translateY(0)":"translateY(50px)", transition:"all .9s .4s cubic-bezier(.16,1,.3,1)" }}>
            {STATS.map((s,i) => <StatCard key={i} s={s} inView={statsIn} span={i===STATS.length-1?2:1} />)}
            <div style={{ gridColumn:"span 2", border:"1px solid rgba(212,175,55,0.18)", background:"rgba(255,255,255,0.02)", padding:"34px" }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.25em", color:"#C9CCD6", textTransform:"uppercase", marginBottom:8 }}>Headquarters</div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"1.7rem", fontWeight:900, background:"linear-gradient(135deg,#D4AF37,#E6C87A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Pune, India</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ s, inView, span=1 }) {
  const val = useCounter(s.number, inView);
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ gridColumn:`span ${span}`, border:`1px solid ${hover?"rgba(212,175,55,0.35)":"rgba(212,175,55,0.15)"}`, background: hover?"rgba(212,175,55,0.07)":"rgba(255,255,255,0.02)", padding:"34px", transition:"all .4s", cursor:"default" }}>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"2.4rem", fontWeight:900, background:"linear-gradient(135deg,#D4AF37,#E6C87A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>{val}</div>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.25em", color:"#C9CCD6", textTransform:"uppercase", marginTop:8 }}>{s.label}</div>
    </div>
  );
}

// ─── FOUNDER ─────────────────────────────────────────────────────────────────
function Founder() {
  const [hRef, inView] = useInView();
  const BADGES = ["Visionary Deep-Tech Entrepreneur","Architect of Innovation","Leader of Ethical AI","Builder of Digital Kingdoms"];
  return (
    <section id="visionary" style={{ padding:"110px 60px", background:"radial-gradient(ellipse at 30% 50%,rgba(30,58,138,0.14) 0%,transparent 60%),#080808", position:"relative" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div ref={hRef}><SectionHeader inView={inView} label="The Architect" title="The Visionary Leader" /></div>
        <div style={{ display:"grid", gridTemplateColumns:"360px 1fr", gap:90, marginTop:72, alignItems:"start" }}>
          {/* Card */}
          <div style={{ border:"1px solid rgba(212,175,55,0.22)", background:"linear-gradient(145deg,rgba(212,175,55,0.07),rgba(5,11,26,0.8))", padding:"44px 40px", textAlign:"center", position:"relative", opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(50px)", transition:"all .9s .2s cubic-bezier(.16,1,.3,1)" }}>
            {[["top","left","2px 0 0 2px"],["bottom","right","0 2px 2px 0"]].map(([v,h,bw],i)=>(
              <div key={i} style={{ position:"absolute", [v]:"-1px", [h]:"-1px", width:22, height:22, borderColor:"#D4AF37", borderStyle:"solid", borderWidth:bw }} />
            ))}
            <img
  src={ceoImage}
  alt="Founder"
  style={{
    width:190,
    height:190,
    borderRadius:"50%",
    objectFit:"cover",
    margin:"0 auto 24px",
    display:"block",
    border:"3px solid rgba(212,175,55,0.45)",
    boxShadow:"0 0 40px rgba(212,175,55,0.2)"
  }}
/>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:"1.2rem", fontWeight:700, color:"#FAF9F6", marginBottom:6 }}>Founder & CEO</div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.62rem", letterSpacing:"0.25em", color:"#D4AF37", textTransform:"uppercase" }}>Seyonix Groups</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.7rem", fontStyle:"italic", color:"#D4AF37", margin:"20px 0", opacity:0.8 }}>Pankaj sharma</div>
            <div style={{ height:1, background:"linear-gradient(to right,transparent,rgba(212,175,55,0.4),transparent)", margin:"0 0 22px" }} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
              {["Visionary","AI Pioneer","Builder"].map(b=><Badge key={b}>{b}</Badge>)}
            </div>
          </div>
          {/* Content */}
          <div style={{ paddingTop:20, opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(50px)", transition:"all .9s .4s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.5em", color:"#D4AF37", textTransform:"uppercase", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}><span>◆</span>Leadership</div>
            <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:"2rem", fontWeight:700, background:"linear-gradient(135deg,#FAF9F6,#E6C87A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:16, lineHeight:1.2 }}>Architect of<br/>Innovation</h3>
            <div style={{ width:70, height:2, background:"linear-gradient(to right,#D4AF37,transparent)", marginBottom:20 }} />
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontWeight:300, fontStyle:"italic", color:"#C9CCD6", lineHeight:1.7, marginBottom:28 }}>
              A visionary deep-tech entrepreneur from Pune, India — driven by a singular mission: to build digital empires that outlast generations.
            </p>
            <blockquote style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", fontWeight:300, fontStyle:"italic", color:"#FAF9F6", lineHeight:1.55, margin:"0 0 28px", paddingLeft:24, borderLeft:"2px solid #D4AF37" }}>
              "We do not build products. We build thrones. Technology is our crown, and the world is our kingdom."
            </blockquote>
            <p style={{ fontSize:"0.9rem", color:"#C9CCD6", lineHeight:1.75, marginBottom:30 }}>
              Leading the charge at the intersection of artificial intelligence, ethical technology, and visionary product design. Every decision made with royal precision. Every innovation built to endure.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {BADGES.map(b=><Badge key={b}>{b}</Badge>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Badge = ({ children }) => {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ padding:"8px 16px", border:`1px solid ${hover?"rgba(212,175,55,0.5)":"rgba(212,175,55,0.22)"}`, background: hover?"rgba(212,175,55,0.1)":"rgba(255,255,255,0.03)", fontFamily:"'Cinzel',serif", fontSize:"0.58rem", letterSpacing:"0.2em", color:"#E6C87A", textTransform:"uppercase", transition:"all .3s", cursor:"default" }}>{children}</div>
  );
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
function Products() {
  const [hRef, inView] = useInView();
  return (
    <section id="kingdom" style={{ padding:"110px 60px", background:"linear-gradient(160deg,#050B1A,#080808 60%)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div ref={hRef} style={{ textAlign:"center" }}><SectionHeader inView={inView} center label="The Royal Arsenal" title="Our Royal Innovations" sub="Three crowns. Three kingdoms. One unstoppable empire." /></div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, marginTop:72 }}>
          {PRODUCTS.map((p,i) => <ProductCard key={i} p={p} inView={inView} delay={i*.15} />)}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, inView, delay=0 }) {
  const [hover, setHover] = useState(false);
  const [mx, setMx] = useState(50); const [my, setMy] = useState(50);
  const onMouse = e => { const r=e.currentTarget.getBoundingClientRect(); setMx(((e.clientX-r.left)/r.width)*100); setMy(((e.clientY-r.top)/r.height)*100); };
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onMouseMove={onMouse}
      style={{ position:"relative", padding:"58px 38px", background: hover?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.02)", border:`1px solid ${hover?"rgba(212,175,55,0.4)":"rgba(212,175,55,0.15)"}`, overflow:"hidden", transition:"all .5s", transform: hover?"translateY(-8px)":"translateY(0)", boxShadow: hover?"0 20px 60px rgba(0,0,0,0.5),0 0 40px rgba(212,175,55,0.1)":"none", cursor:"default", opacity:inView?1:0, transitionDelay:`${delay}s`, transitionProperty:"all" }}>
      {/* Shimmer */}
      {hover && <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at ${mx}% ${my}%, rgba(212,175,55,0.08) 0%, transparent 60%)`, pointerEvents:"none" }} />}
      {/* Top line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,#D4AF37,transparent)", transform: hover?"scaleX(1)":"scaleX(0)", transition:"transform .5s" }} />
      <div style={{ position:"absolute", top:28, right:28, fontFamily:"'Cinzel Decorative',serif", fontSize:"3.5rem", fontWeight:900, color: hover?"rgba(212,175,55,0.14)":"rgba(212,175,55,0.07)", lineHeight:1, transition:"color .5s" }}>{p.num}</div>
      <span style={{ fontSize:"2rem", marginBottom:22, display:"block", filter:"drop-shadow(0 0 10px rgba(212,175,55,0.4))" }}>{p.icon}</span>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.35em", color:"#D4AF37", textTransform:"uppercase", marginBottom:12 }}>{p.crown}</div>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"1.35rem", fontWeight:700, color:"#FAF9F6", marginBottom:14, lineHeight:1.2 }}>{p.name}</div>
      <div style={{ fontSize:"0.88rem", color:"#C9CCD6", lineHeight:1.72, marginBottom:28 }}>{p.desc}</div>
      <a
  href={p.link}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display:"inline-flex",
    alignItems:"center",
    gap: hover?14:8,
    fontFamily:"'Cinzel',serif",
    fontSize:"0.6rem",
    letterSpacing:"0.25em",
    color:"#D4AF37",
    textTransform:"uppercase",
    textDecoration:"none",
    transition:"gap .3s"
  }}
>
  Explore Kingdom →
</a>
    </div>
  );
}

// ─── TECH ─────────────────────────────────────────────────────────────────────
function Tech() {
  const [hRef, inView] = useInView();
  return (
    <section id="power" style={{ padding:"110px 60px", background:"#080808" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div ref={hRef} style={{ textAlign:"center" }}><SectionHeader inView={inView} center label="Infrastructure of Power" title="The Power Behind the Throne" sub="Six pillars of technological supremacy holding up the Seyonix empire." /></div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, marginTop:72 }}>
          {TECH.map((t,i) => <TechItem key={i} t={t} inView={inView} delay={i*.1} />)}
        </div>
      </div>
    </section>
  );
}

function TechItem({ t, inView, delay=0 }) {
  const [hover, setHover] = useState(false);
  const R = 30, C = 2 * Math.PI * R;
  const dash = C * (t.pct / 100);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding:"46px 34px", border:`1px solid ${hover?"rgba(212,175,55,0.35)":"rgba(212,175,55,0.15)"}`, background: hover?"rgba(212,175,55,0.04)":"rgba(255,255,255,0.02)", transition:"all .4s", opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(40px)", transitionDelay:`${delay}s` }}>
      <div style={{ width:72, height:72, position:"relative", marginBottom:24 }}>
        <svg viewBox="0 0 70 70" fill="none" style={{ position:"absolute", inset:0, transform:"rotate(-90deg)" }}>
          <circle cx="35" cy="35" r={R} stroke="rgba(212,175,55,0.1)" strokeWidth="2" fill="none" />
          <circle cx="35" cy="35" r={R} stroke="#D4AF37" strokeWidth="2" fill="none"
            strokeDasharray={C} strokeDashoffset={inView ? C - dash : C}
            style={{ transition:`stroke-dashoffset 1.5s ${delay + 0.3}s ease`, strokeLinecap:"round" }} />
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem" }}>{t.icon}</div>
      </div>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.9rem", fontWeight:600, color:"#FAF9F6", marginBottom:10, letterSpacing:"0.04em" }}>{t.name}</div>
      <div style={{ fontSize:"0.85rem", color:"#C9CCD6", lineHeight:1.68 }}>{t.desc}</div>
    </div>
  );
}

// ─── WHY ──────────────────────────────────────────────────────────────────────
function Why() {
  const [hRef, inView] = useInView();
  return (
    <section id="authority" style={{ padding:"110px 60px", background:"linear-gradient(160deg,#050B1A 0%,#080808 100%)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div ref={hRef} style={{ textAlign:"center" }}><SectionHeader inView={inView} center label="The Reason to Bow" title="Why We Rule" sub="Six sovereign pillars that make Seyonix Groups not just a company — but a dynasty." /></div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, marginTop:72 }}>
          {WHY.map((w,i) => <WhyCard key={i} w={w} inView={inView} delay={i*.1} />)}
        </div>
      </div>
    </section>
  );
}

function WhyCard({ w, inView, delay=0 }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding:"46px 34px", border:`1px solid ${hover?"rgba(212,175,55,0.35)":"rgba(212,175,55,0.15)"}`, background:"rgba(255,255,255,0.02)", transition:"all .4s", transform: hover?"translateY(-4px)":"translateY(0)", position:"relative", overflow:"hidden", opacity:inView?1:0, transitionDelay:`${delay}s` }}>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"linear-gradient(to right,transparent,#D4AF37,transparent)", transform: hover?"scaleX(1)":"scaleX(0)", transition:"transform .4s" }} />
      <span style={{ fontSize:"1.8rem", marginBottom:18, display:"block", filter:"drop-shadow(0 0 8px rgba(212,175,55,0.4))" }}>{w.icon}</span>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.85rem", fontWeight:700, color:"#FAF9F6", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>{w.title}</div>
      <div style={{ fontSize:"0.85rem", color:"#C9CCD6", lineHeight:1.68 }}>{w.desc}</div>
    </div>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [hRef, inView] = useInView();
  const [form, setForm] = useState({ name:"", email:"", company:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const handleSubmit = async () => {

    if (!form.name || !form.email) {
      alert("Name and Email required");
      return;
    }
  
    try {
  
      const response = await axios.post(
        "/api/contact",
        form
      );
  
      console.log(response.data);
  
      setSent(true);
  
      setTimeout(() => setSent(false), 4000);
  
      setForm({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: ""
      });
  
    } catch (error) {
  
      console.error("Error sending message:", error);
  
    }
  
  };
  const inputStyle = (focused=false) => ({ width:"100%", padding:"15px 18px", background:"rgba(255,255,255,0.03)", border:`1px solid ${focused?"rgba(212,175,55,0.45)":"rgba(212,175,55,0.18)"}`, color:"#FAF9F6", fontFamily:"'Lato',sans-serif", fontSize:"0.9rem", outline:"none", transition:"border-color .3s", boxSizing:"border-box" });
  const [focused, setFocused] = useState({});
  const DETAILS = [
    { icon:"📍", label:"Headquarters", val:"Pune, Maharashtra, India" },
    { icon:"🏛️", label:"Industry",     val:"Deep Technology Products" },
    { icon:"🌐", label:"Website",      val:"seyonixgroups.com" },
    { icon:"✉️", label:"Email",        val:"seyonixdeveloper.pvt@gmai.com" },
  ];
  return (
    <section id="alliance" style={{ padding:"110px 60px", background:"radial-gradient(ellipse at 70% 50%,rgba(30,58,138,0.1) 0%,transparent 60%),#080808" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div ref={hRef} style={{ textAlign:"center" }}><SectionHeader inView={inView} center label="Open the Gates" title="Forge an Alliance" sub="The empire welcomes those worthy of partnership. Reach us and begin your legacy." /></div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, marginTop:72 }}>
          {/* Info */}
          <div style={{ opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(40px)", transition:"all .9s .2s cubic-bezier(.16,1,.3,1)" }}>
            {DETAILS.map((d,i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:18, padding:"22px 0", borderBottom:"1px solid rgba(212,175,55,0.08)" }}>
                <div style={{ width:42, height:42, flexShrink:0, border:"1px solid rgba(212,175,55,0.35)", background:"rgba(212,175,55,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>{d.icon}</div>
                <div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.58rem", letterSpacing:"0.3em", color:"#D4AF37", textTransform:"uppercase", marginBottom:4 }}>{d.label}</div>
                  <div style={{ fontSize:"0.9rem", color:"#C9CCD6" }}>{d.val}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:40 }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.58rem", letterSpacing:"0.4em", color:"#D4AF37", textTransform:"uppercase", marginBottom:18 }}>◆ The Kingdom</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
                {PRODUCTS.map((p,i) => (
                  <div key={i} style={{ padding:"18px", border:"1px solid rgba(212,175,55,0.15)", background:"rgba(255,255,255,0.02)", textAlign:"center", cursor:"pointer", transition:"all .3s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(212,175,55,0.4)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(212,175,55,0.15)";}}>
                    <div style={{ fontSize:"1.2rem", marginBottom:6 }}>{p.icon}</div>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.56rem", letterSpacing:"0.2em", color:"#D4AF37", textTransform:"uppercase" }}>{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Form */}
          <div style={{ opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(40px)", transition:"all .9s .4s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ border:"1px solid rgba(212,175,55,0.2)", background:"rgba(255,255,255,0.02)", padding:"44px", position:"relative" }}>
              {[["top","left","2px 0 0 2px"],["bottom","right","0 2px 2px 0"]].map(([v,h,bw],i)=>(
                <div key={i} style={{ position:"absolute", [v]:-1, [h]:-1, width:24, height:24, borderColor:"#D4AF37", borderStyle:"solid", borderWidth:bw }} />
              ))}
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.58rem", letterSpacing:"0.4em", color:"#D4AF37", textTransform:"uppercase", marginBottom:26 }}>◆ Send Word</div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[["name","Your Name","text"],["email","Your Email","email"],["company","Your Company","text"],["subject","Subject","text"]].map(([k,ph,type]) => (
                  <input key={k} type={type} placeholder={ph} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                    onFocus={()=>setFocused(p=>({...p,[k]:true}))} onBlur={()=>setFocused(p=>({...p,[k]:false}))}
                    style={inputStyle(focused[k])} />
                ))}
                <textarea placeholder="Your Message to the Empire..." value={form.message} onChange={e => setForm({...form,message:e.target.value})}
                  onFocus={()=>setFocused(p=>({...p,msg:true}))} onBlur={()=>setFocused(p=>({...p,msg:false}))}
                  style={{ ...inputStyle(focused.msg), minHeight:120, resize:"vertical" }} />
                <RoyalButton onClick={handleSubmit} style={{ width:"100%" }}>
                  {sent ? "Message Delivered ◆" : "Dispatch Royal Message"}
                </RoyalButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = id =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const columns = [
    {
      title: "The Empire",
      links: [
        ["Legacy", "legacy-section"],
        ["Visionary", "visionary"],
        ["Kingdom", "kingdom"],
        ["Power", "power"]
      ]
    },
    {
      title: "Products",
      links: [
        ["EternaLegacy AI", "kingdom"],
        ["zynext.in", "kingdom"],
        ["Artzone", "kingdom"],
        ["Coming Soon", "kingdom"]
      ]
    },
    {
      title: "Alliance",
      links: [
        ["Contact Us", "alliance"],
        ["Partnerships", "alliance"],
        ["Careers", "alliance"],
        ["Press", "alliance"]
      ]
    }
  ];

  const socials = [
    { icon: "𝕏", link: "https://x.com/seyonixgroups" },
    { icon: "in", link: "https://www.linkedin.com/company/seyonix99-developers/" },
    { icon: "IG", link: "https://www.instagram.com/seyoni.x?igsh=MTFsazdycGk3aXdvbw==" },
    { icon: "YT", link: "https://youtube.com/@becomingthefounder?si=H_nfANur-16viawc" }
  ];

  return (
    <footer
      style={{
        background: "#050B1A",
        borderTop: "1px solid rgba(212,175,55,0.15)",
        padding: "58px 60px 30px"
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 50
        }}
      >
        {/* COLUMN 1 */}
        <div>
          <div
            style={{
              fontFamily: "'Cinzel Decorative',serif",
              fontSize: "1.05rem",
              fontWeight: 700,
              background: "linear-gradient(135deg,#D4AF37,#E6C87A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 14
            }}
          >
            SEYONIX GROUPS
          </div>

          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontStyle: "italic",
              fontSize: "0.95rem",
              color: "#C9CCD6",
              lineHeight: 1.7,
              marginBottom: 24
            }}
          >
            "Engineering Legacy.<br />
            Building Empires."
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {socials.map(s => (
              <a
                key={s.icon}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    border: "1px solid rgba(212,175,55,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#C9CCD6",
                    fontSize: "0.8rem"
                  }}
                >
                  {s.icon}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* OTHER COLUMNS */}
        {columns.map(col => (
          <div key={col.title}>
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "0.62rem",
                letterSpacing: "0.3em",
                color: "#D4AF37",
                textTransform: "uppercase",
                marginBottom: 18
              }}
            >
              {col.title}
            </div>

            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: 0
              }}
            >
              {col.links.map(([label, id]) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo(id)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "0.85rem",
                      color: "#C9CCD6",
                      cursor: "pointer"
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* BOTTOM ROW */}
      <div
        style={{
          maxWidth: 1280,
          margin: "36px auto 0",
          paddingTop: 22,
          borderTop: "1px solid rgba(212,175,55,0.08)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            color: "rgba(201,204,214,0.4)"
          }}
        >
          © 2024 Seyonix Groups. All Rights Reserved. ◆ Pune, India
        </div>

        <div
          style={{
            fontFamily: "'Cinzel Decorative',serif",
            fontSize: "0.65rem",
            color: "#D4AF37",
            letterSpacing: "0.15em"
          }}
        >
          ◆ SEYONIX GROUPS · EST. 2024 ◆
        </div>

        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.58rem",
            letterSpacing: "0.15em",
            color: "rgba(201,204,214,0.4)"
          }}
        >
          Privacy Policy ◆ Terms of Empire
        </div>
      </div>
    </footer>
  );
}


// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("legacy");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["legacy","visionary","kingdom","power","authority","alliance"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 200) { setActiveSection(sections[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lato:wght@300;400;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#080808;color:#FAF9F6;font-family:'Lato',sans-serif;overflow-x:hidden;cursor:none;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:#050B1A;}
        ::-webkit-scrollbar-thumb{background:#D4AF37;border-radius:2px;}
        input,textarea{font-family:'Lato',sans-serif;}
        input::placeholder,textarea::placeholder{color:rgba(201,204,214,0.35);}
        @keyframes particleFloat{0%{transform:translateY(0);opacity:0;}10%{opacity:.6;}90%{opacity:.25;}100%{transform:translateY(-100vh) translateX(20px);opacity:0;}}
        @keyframes rayRotate{from{transform:translateX(-50%) rotate(0deg);}to{transform:translateX(-50%) rotate(360deg);}}
        @keyframes scrollPulse{0%,100%{transform:scaleY(1);opacity:.6;}50%{transform:scaleY(.5);opacity:1;}}
        @keyframes portraitRing{0%,100%{transform:scale(1);opacity:.5;}50%{transform:scale(1.05);opacity:1;}}
        @keyframes glowPulse{0%,100%{filter:drop-shadow(0 0 10px rgba(212,175,55,.3));}50%{filter:drop-shadow(0 0 30px rgba(212,175,55,.7));}}
      `}</style>
      <Cursor />
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Nav scrolled={scrolled} activeSection={activeSection} />
      <main>
        <Hero />
        <div style={{ height:1, background:"linear-gradient(to right,transparent,rgba(212,175,55,0.4),transparent)" }} />
        <About />
        <GoldDivider label="The Visionary" />
        <Founder />
        <div style={{ height:1, background:"linear-gradient(to right,transparent,rgba(212,175,55,0.4),transparent)" }} />
        <Products />
        <GoldDivider label="The Technology" />
        <Tech />
        <div style={{ height:1, background:"linear-gradient(to right,transparent,rgba(212,175,55,0.4),transparent)" }} />
        <Why />
        <GoldDivider label="Alliance" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

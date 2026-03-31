import { useState, useEffect, useMemo } from "react";
import hackbyteLogo from "../../../hackbyte4.png";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import AlertsPage from "./pages/AlertsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import NearestCCTVs from "./pages/NearestCCTVs";
import NotifyPage from "./pages/NotifyPage";
import ChatBotPage from "./pages/ChatBotPage";
import AnomalyGraph from "./pages/AnomalyGraph";
import CaseMapPage from "./pages/CaseMapPage";
import Testing from "./pages/Testing";

// Floating particle component
const Particle = ({ style }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing core systems...");

  const statusMessages = [
    "Initializing core systems...",
    "Booting deep-learning modules...",
    "Syncing with global CCTV grid...",
    "Establishing blockchain consensus...",
    "Decrypting video streams...",
    "Launching SentinelIQ Environment...",
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProgress(current);
      const msgIndex = Math.floor((current / 100) * (statusMessages.length - 1));
      setStatusText(statusMessages[Math.min(msgIndex, statusMessages.length - 1)]);
      if (current >= 100) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      style: {
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        background: Math.random() > 0.5 ? "#818cf8" : "#c084fc",
        boxShadow: `0 0 ${Math.random() * 10 + 5}px ${Math.random() > 0.5 ? "#818cf8" : "#c084fc"}`,
        animation: `float ${3 + Math.random() * 5}s ease-in-out ${Math.random() * 2}s infinite alternate`,
      },
    }));
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center",
      background: "radial-gradient(circle at center, #1e1b4b 0%, #020617 100%)",
      overflow: "hidden", fontFamily: "'Inter', sans-serif", zIndex: 9999,
    }}>

      {/* Grid Overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.15,
        backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Scanline Effect */}
      <div style={{
        position: 'absolute', width: '100%', height: '4px',
        background: 'rgba(129, 140, 248, 0.5)',
        boxShadow: '0 0 20px rgba(129, 140, 248, 0.8)',
        animation: 'scanline 4s linear infinite', pointerEvents: 'none'
      }} />

      {/* Floating Particles */}
      {particles.map((p) => <Particle key={p.id} style={p.style} />)}

      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", zIndex:10, maxWidth:"600px", width:"100%", padding:"0 32px" }}>
        
        {/* Animated Logo Container */}
        <div className="fade-in-1" style={{ position: 'relative', marginBottom: "40px", width: "160px", height: "160px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* Outer rotating ring */}
          <div style={{
            position: 'absolute', inset: -10, borderRadius: '50%',
            border: '2px dashed rgba(168,85,247,0.4)',
            animation: 'spin-slow 15s linear infinite'
          }} />
          {/* Inner rotating ring */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            borderTop: '3px solid #818cf8', borderRight: '3px solid transparent',
            borderBottom: '3px solid transparent', borderLeft: '3px solid #c084fc',
            animation: 'spin-reverse 10s linear infinite'
          }} />
          {/* Core Glow */}
          <div style={{
            position: 'absolute', inset: 10, borderRadius: '50%', background: 'rgba(2,6,23,0.8)',
            animation: 'pulse-glow 3s ease-in-out infinite'
          }} />
          <img
            src={hackbyteLogo}
            alt="HackByte Logo"
            style={{ width: "90px", height: "90px", objectFit: "contain", position: 'relative', zIndex: 10, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}
          />
        </div>

        {/* Title */}
        <div className="fade-in-2" style={{ textAlign:"center", marginBottom:"8px" }}>
          <h1 className="text-gradient" style={{ fontSize:"3.5rem", fontWeight:900, letterSpacing:"0.15em", margin:0, textTransform:"uppercase", textShadow: '0 0 30px rgba(168,85,247,0.5)' }}>
            SentinelIQ
          </h1>
        </div>

        {/* Subtitle */}
        <div className="fade-in-3" style={{ textAlign:"center", marginBottom:"48px" }}>
          <p style={{ color:"#94a3b8", fontSize:"0.95rem", letterSpacing:"0.08em", margin:0, fontWeight:500, textTransform: 'uppercase' }}>
            Intelligent Surveillance &amp; Case Intelligence Platform
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="fade-in-4" style={{ width:"100%", position: 'relative' }}>
          {/* Progress Percent & Glow */}
          <div style={{ position: 'absolute', right: 0, top: '-25px', color:"#e2e8f0", fontSize:"0.85rem", fontWeight:700, letterSpacing: "1px", textShadow: '0 0 10px #c084fc' }}>
            {progress}%
          </div>

          <div style={{ width:"100%", height:"6px", background:"rgba(30,41,59,0.8)", borderRadius:"999px", overflow:"hidden", marginBottom:"16px", border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
            <div style={{ 
              height:"100%", width:`${progress}%`, 
              background:"linear-gradient(90deg, #6366f1, #a855f7, #ec4899)", 
              borderRadius:"999px", transition:"width 0.1s ease-out",
              boxShadow: '0 0 15px rgba(168,85,247,0.8), 0 0 5px rgba(236,72,153,0.8)',
              position: 'relative'
            }}>
              {/* Highlight flare on the end of the progress bar */}
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '20px', background: 'linear-gradient(90deg, transparent, white)', opacity: 0.8 }} />
            </div>
          </div>
          
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:"#cbd5e1", fontSize:"0.8rem", fontWeight:600, letterSpacing: "0.5px" }}>
              {statusText}
            </span>
            <span style={{ color:"#475569", fontSize:"0.7rem", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:700 }}>
              SYS/BOOT_SEQ
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

function App() {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-100 overflow-hidden font-sans">
      {showAnimation ? (
        <SplashScreen />
      ) : (
        <>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/case-statistics" element={<UsersPage />} />
              <Route path="/notify" element={<NotifyPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/nearest-cctvs" element={<NearestCCTVs />} />
              <Route path="/chatbot" element={<ChatBotPage />} />
              <Route path="/anomalygraph" element={<AnomalyGraph />} />
              <Route path="/casemap" element={<CaseMapPage />} />
              <Route path="/testing" element={<Testing />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

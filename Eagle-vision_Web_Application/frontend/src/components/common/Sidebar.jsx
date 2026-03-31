import { AlertCircle, BarChart2, Cctv, Settings, Menu, Users, Bell, GitGraph, TestTube, Network, ChartNetwork } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import ConnectWallet from "./ConnectWallet";

const Logo = () => {
  return (
    <motion.div
      className="text-white flex items-center mb-2 mt-1"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="text-2xl font-bold tracking-tight text-white">
        SentinelIQ
      </div>
    </motion.div>
  );
};



const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: BarChart2,
    color: "#6366f1",
    href: "/",
  },
  
  { name: "Alerts", icon: AlertCircle, color: "#FF0000", href: "/alerts", count: 0 },
  { name: "CaseMap", icon: ChartNetwork, color: "#4169E1", href: "/casemap" },
  // { name: "Anomaly Graph", icon: GitGraph, color: "#FF0000", href: "/anomalygraph"},
  { name: "Query Retriver", icon: FaRobot, color: "#8B5CF6", href: "/chatbot"},
  { name: "Notify", icon: Bell, color: "#8B5CF6", href: "/notify" },
  { name: "Nearest CCTV", icon: Cctv, color: "#3B82F6", href: "/nearest-cctvs" },
  { name: "Case Statistics", icon: Users, color: "#EC4899", href: "/case-statistics" },
  { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
  { name: "Testing", icon: TestTube, color: "#6EE7B7", href: "/testing" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${BACKEND_URL}/api/alerts/fetch-alert-count`);
        const data = await response.json();
        setAlertCount(data.count);
      } catch (error) {
        console.error('Error fetching alert count:', error);
      }
    };

    fetchAlertCount();
  }, []);

  const audioRef = useRef(null);
  if (!audioRef.current) {
    audioRef.current = new Audio("/path-to-your-audio-file/alert-sound.mp3");
  }

  useEffect(() => {
    if (alertCount > 0) {
      audioRef.current?.play().catch(() => {}); // Ignore autoplay errors
    }
  }, [alertCount]);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-[#0a0a0a] border-r border-white/5 p-4 flex flex-col">
        <div className="flex items-center justify-start space-x-4 mb-4 mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 ml-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Menu size={24} />
          </motion.button>
          {isSidebarOpen && <Logo />}
        </div>

        <nav className="mt-4 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div
                className="flex items-center p-3 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all mb-1.5 cursor-pointer group"
              >
                <item.icon size={20} className="group-hover:text-indigo-400 transition-colors" style={{ color: item.color, minWidth: "20px" }} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-3 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Connect Wallet — bottom of sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mt-auto pt-3 border-t border-white/5"
            >
              <ConnectWallet compact={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


export default Sidebar;

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Camera,
  CameraOff,
  Cctv,
  CheckCircle,
  Zap,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { FiRefreshCcw } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import StatCard from "../components/common/StatCard";
import AlertOverviewChart from "../components/overview/AlertOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/AlertSourcesChart";
import { Player } from "@lottiefiles/react-lottie-player";

const OverviewPage = () => {
  const [stats, setStats] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not detected. Please install it.");
  
    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      const balance = await providerInstance.getBalance(accounts[0]);
  
      setAccount(accounts[0]);
      setBalance(ethers.formatEther(balance));
  
      localStorage.setItem("walletAccount", accounts[0]); // Save to localStorage
      localStorage.setItem("walletBalance", ethers.formatEther(balance));
    } catch (err) {
      console.error("Connection error:", err);
      alert("Connection Failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedAccount = localStorage.getItem("walletAccount");
    const savedBalance = localStorage.getItem("walletBalance");
    if (savedAccount) {
      setAccount(savedAccount);
      setBalance(savedBalance);
    }
    
    // Fetch live dashboard stats
    const fetchStats = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${BACKEND_URL}/api/dashboard/fetch-stats`);
        if (response.ok) {
          const data = await response.json();
          // Assuming backend returns an array of stat objects similar to the old json
          setStats(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch live stats:", error);
      }
    };

    // Fetch live alerts for the Recent Cases table
    const fetchAlerts = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${BACKEND_URL}/api/alerts/get-alerts`);
        if (response.ok) {
          const data = await response.json();
          // Keep only the 5 most recent
          setRecentAlerts(Array.isArray(data) ? data.slice(0, 5) : []);
        }
      } catch (error) {
        console.error("Failed to fetch recent alerts:", error);
      }
    };

    fetchStats();
    fetchAlerts();
  }, []);
  

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Pulse animation for title
  const pulseTitleVariants = {
    initial: { textShadow: "0 0 8px rgba(66, 153, 225, 0)" },
    animate: { 
      textShadow: [
        "0 0 8px rgba(66, 153, 225, 0)",
        "0 0 15px rgba(66, 153, 225, 0.7)",
        "0 0 8px rgba(66, 153, 225, 0)"
      ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  function getFirstFourDecimalDigits(num) {
    let decimalPart = num.toString().split('.')[1] || '0000'; // Get decimal part or default to '0000'
    decimalPart = (decimalPart + '0000').substring(0, 4); // Ensure at least 4 digits
    return `0.${decimalPart}`;
}

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-[#0a0a0a] text-zinc-100 min-h-screen">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <div className="bg-zinc-800/50 p-2.5 rounded-lg border border-white/10 shadow-sm">
            <Cctv className="h-6 w-6 text-zinc-300" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SentinelIQ Central
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {account ? (
            <div className="bg-[#18181b] text-white px-4 py-2 rounded-lg border border-white/10 shadow-sm flex items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  <p className="text-xs font-semibold text-zinc-400 tracking-wider">NETWORK LIVE</p>
                </div>
                <p className="text-sm font-mono text-zinc-300">{account.slice(0, 6)}...{account.slice(-4)}</p>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <p className="text-sm font-bold text-white">
                {getFirstFourDecimalDigits(balance)} EDU
              </p>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-white text-black hover:bg-zinc-200 transition-colors font-medium px-5 py-2.5 rounded-lg text-sm shadow-sm flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <FiRefreshCcw className="h-4 w-4 mr-2 animate-spin text-zinc-600" />
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Connect Wallet</span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 mt-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {[
            { name: "Total Cameras", icon: Camera, colorClass: "border-indigo-500/40", fallback: "245" },
            { name: "Pending Alerts", icon: AlertTriangle, colorClass: "border-amber-500/40", fallback: "2" },
            { name: "Critical Alerts", icon: AlertOctagon, colorClass: "border-rose-500/40", fallback: "1" },
            { name: "Active Cameras", icon: Cctv, colorClass: "border-emerald-500/40", fallback: "235" },
            { name: "Total Alerts Today", icon: Zap, colorClass: "border-indigo-500/40", fallback: "59" },
            { name: "Offline Cameras", icon: CameraOff, colorClass: "border-rose-500/40", fallback: "15" },
            { name: "Cameras with Active Alerts", icon: AlertCircle, colorClass: "border-emerald-500/40", fallback: "40" },
            { name: "Resolved Alerts", icon: CheckCircle, colorClass: "border-zinc-500/40", fallback: "40" }
          ].map((templateStat, index) => {
            // Find the real fetched stat value if it exists, otherwise default to the fallback dummy data
            const realStat = stats.find(s => s.name === templateStat.name);
            const value = realStat ? realStat.value : templateStat.fallback;

            return (
              <motion.div
                key={templateStat.name}
                variants={itemVariants}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <StatCard 
                  name={templateStat.name} 
                  icon={templateStat.icon} 
                  value={value} 
                  colorClass={templateStat.colorClass} 
                />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {/* Recent Cases Section */}
          <div className="bg-[#18181b] rounded-xl border border-white/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-400" /> Recent Cases
              </h2>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Live Feed</span>
            </div>
            <div className="p-5 flex-1 w-full overflow-x-auto">
              {recentAlerts && recentAlerts.length > 0 ? (
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-tl-lg">Case ID</th>
                      <th className="px-4 py-3 font-semibold">Classification</th>
                      <th className="px-4 py-3 font-semibold">Time</th>
                      <th className="px-4 py-3 font-semibold rounded-tr-lg">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentAlerts.map((c, i) => {
                      const priority = c.severity || 'Medium';
                      return (
                        <tr key={c._id || i} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3.5 font-mono text-zinc-300">
                            {(c._id || "").toString().slice(-6).toUpperCase() || `CASE-0${i}`}
                          </td>
                          <td className="px-4 py-3.5 text-white">{c.alert_type || "Anomaly"}</td>
                          <td className="px-4 py-3.5 text-zinc-400 text-xs">
                            {c.date ? new Date(c.date).toLocaleTimeString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                              priority.toLowerCase() === 'critical' || priority.toLowerCase() === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              priority.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {priority}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[150px] text-zinc-500 text-sm">
                  No active cases in the ledger.
                </div>
              )}
            </div>
          </div>

          {/* Camera Status Section */}
          <div className="bg-[#18181b] rounded-xl border border-white/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cctv className="w-5 h-5 text-emerald-400" /> Camera Nodes Status
              </h2>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Network Grid</span>
            </div>
            <div className="p-5 flex-1 w-full overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-tl-lg">Node ID</th>
                    <th className="px-4 py-3 font-semibold">Zone</th>
                    <th className="px-4 py-3 font-semibold">Uptime</th>
                    <th className="px-4 py-3 font-semibold rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { id: "CAM-N-01", zone: "North Wing", uptime: "99.9%", status: "Active" },
                    { id: "CAM-N-02", zone: "North Perimeter", uptime: "99.8%", status: "Active" },
                    { id: "CAM-E-01", zone: "East Gate", uptime: "98.5%", status: "Maintenance" },
                    { id: "CAM-S-04", zone: "South Parking", uptime: "0.0%", status: "Offline" },
                  ].map((node, i) => (
                    <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-zinc-300">{node.id}</td>
                      <td className="px-4 py-3.5 text-white">{node.zone}</td>
                      <td className="px-4 py-3.5 font-mono text-xs">{node.uptime}</td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-2 text-xs font-medium">
                          <span className={`w-2 h-2 rounded-full ${
                            node.status === 'Active' ? 'bg-emerald-500 animate-pulse' :
                            node.status === 'Maintenance' ? 'bg-amber-500' :
                            'bg-rose-500'
                          }`}></span>
                          <span className={`${
                            node.status === 'Active' ? 'text-emerald-400' :
                            node.status === 'Maintenance' ? 'text-amber-400' :
                            'text-rose-400'
                          }`}>
                            {node.status}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="bg-[#18181b] rounded-xl border border-white/5 shadow-sm overflow-hidden">
            <AlertOverviewChart />
          </div>
          
          <div className="bg-[#18181b] rounded-xl border border-white/5 shadow-sm overflow-hidden">
            <CategoryDistributionChart />
          </div>
          
          <div className="bg-[#18181b] rounded-xl border border-white/5 shadow-sm overflow-hidden lg:col-span-2">
            <SalesChannelChart />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default OverviewPage;
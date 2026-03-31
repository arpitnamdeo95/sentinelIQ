import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiCamera, FiBell, FiTrash2, FiX, FiAlertCircle } from "react-icons/fi";
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { ChartNetworkIcon, Network } from "lucide-react";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showFootage, setShowFootage] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);

  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || "SuperSecretAdminKey123";

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/alerts/fetch-alerts`);
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleLocateAnomaly = (alert) => {
    if (!alert.coordinates) {
      alert("Coordinates not available for this alert.");
      return;
    }
    const [lat, lng] = alert.coordinates.split(",").map(Number);
    if (isNaN(lat) || isNaN(lng)) {
      alert("Invalid coordinates format.");
      return;
    }
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    setSelectedAlert({ ...alert, googleMapsUrl });
    setShowMap(true);
  };

  const handleViewNearestCCTV = (coordinates, locality) => {
    navigate("/nearest-cctvs", {
      state: { coordinates, locality },
    });
  };

  const handleNotify = () => {
    navigate("/notify");
  };

  const handleDeleteAlert = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alert? This action requires Admin credentials.")) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/alerts/delete-alerts/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": ADMIN_KEY
        }
      });
      if (response.ok) {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert._id !== id));
        alert("Alert deleted successfully");
        setShowPopup(false);
      } else {
        alert("Failed to delete alert");
      }
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  const handlePopupOpen = (alert) => {
    setSelectedAlert(alert);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedAlert(null);
    setShowMap(false);
    setShowFootage(false);
  };

  const handleFootageView = (footageUrl) => {
    if (footageUrl) {
      setVideoSrc(footageUrl);
      setShowFootage(true);
    } else {
      alert("Footage URL is not available.");
    }
  };
  // const handleFootageView = async (footageUrl) => {
  //   try {
  //     // Make a request to Flask to fetch the video stream using the footage URL
  //     const response = await fetch(`http://127.0.0.1:5000/stream/${footageUrl}`);
  //     if (response.ok) {
  //       // Get the video blob from the response
  //       const videoBlob = await response.blob();
  //       // Create a URL for the video blob
  //       const videoUrl = URL.createObjectURL(videoBlob);
  //       // Update state with the new video URL
  //       setVideoSrc(videoUrl);
  //       setShowFootage(true);
  //     } else {
  //       alert("Failed to fetch footage.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching footage:", error);
  //   }
  // };
  

  return (
    <div className="flex-1 overflow-auto relative bg-[#0a0a0a] text-zinc-100 min-h-screen">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative z-10">
        <Header title="Alerts" />
        <div className="flex flex-col items-center justify-center py-10 relative">
          <Player autoplay loop src="Emergency.json" className="w-48 h-48" />
          <p className="text-center text-zinc-300 text-lg max-w-2xl mt-4 bg-zinc-900/80 p-6 rounded-xl border border-white/5 shadow-sm">
            The vulnerability detected through our API is displayed here. The Alerts are securely fetched to showcase here. Click on an alert to view footage and details.
          </p>
        </div>

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {alerts.length === 0 ? (
          <p className="text-center text-gray-300">No alerts available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="relative bg-zinc-900 border border-white/5 p-6 rounded-xl shadow-sm hover:border-rose-500/50 transition-all cursor-pointer overflow-hidden group"
                onClick={() => handlePopupOpen(alert)}
              >
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-rose-500/10 p-3 rounded-md mr-4 border border-rose-500/20">
                      <FiAlertCircle size={22} className="text-rose-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Critical Anomaly</h3>
                      <p className="text-zinc-400 text-sm mt-0.5">{alert.anomalyTime}</p>
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPopup && selectedAlert && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl p-8 w-full max-w-5xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
            >

              <button 
                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 p-2 text-sm rounded-lg transition-colors z-20" 
                onClick={handlePopupClose}
              >
                <FiX size={20} />
              </button>
              <h2 className="text-2xl font-bold text-white text-center mb-6 relative z-10">Incident Report</h2>

              {showMap ? (
                <div className="relative w-full mb-6" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={selectedAlert.googleMapsUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : showFootage ? (
                <div className="relative w-full mb-6" style={{ paddingBottom: "56.25%" }}>
                  <video
                    className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
                    controls
                    src={videoSrc}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="mt-6 w-full h-[400px]"></div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                <button
                  className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 px-6 rounded-lg border border-white/5 shadow-sm transition-all"
                  onClick={() => handleLocateAnomaly(selectedAlert)}
                >
                  <FiMapPin className="w-5 h-5 mr-3 text-indigo-400" /> Locate Anomaly
                </button>

                <button
                  className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 px-6 rounded-lg border border-white/5 shadow-sm transition-all"
                  onClick={() => handleViewNearestCCTV(selectedAlert.coordinates, selectedAlert.location)}
                >
                  <FiCamera className="w-5 h-5 mr-3 text-indigo-400" /> View Nearest CCTV
                </button>

                <button
                  className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 px-6 rounded-lg border border-white/5 shadow-sm transition-all"
                  onClick={handleNotify}
                >
                  <FiBell className="w-5 h-5 mr-3 text-indigo-400" /> Notify Authorities
                </button>

                <button
                  className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 px-6 rounded-lg border border-white/5 shadow-sm transition-all"
                  onClick={() => navigate("/casemap")}
                >
                  <ChartNetworkIcon className="w-5 h-5 mr-3 text-indigo-400" /> Generate Case Map
                </button>

                <button
                  className="flex items-center justify-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium py-3 px-6 rounded-lg border border-rose-500/20 shadow-sm transition-all"
                  onClick={() => handleDeleteAlert(selectedAlert._id)}
                >
                  <FiTrash2 className="w-5 h-5 mr-3" /> Dismiss Alert
                </button>
              </div>

              <div className="flex justify-center mt-6 relative z-10 p-4 bg-zinc-900 rounded-xl border border-white/5">
                <button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-8 rounded-lg shadow-sm transition-all flex items-center"
                  onClick={() => handleFootageView(selectedAlert.footageUrl)}
                >
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-3"></span>
                  View Live Footage
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
};

export default AlertsPage;

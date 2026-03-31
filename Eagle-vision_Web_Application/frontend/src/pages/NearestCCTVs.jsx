import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import localities from '../constants/localities';
import { Player } from "@lottiefiles/react-lottie-player";

const ContentWithLottie = () => {
  return (
    <div className="flex items-center justify-center mb-8 space-x-8">
      {/* Lottie Animation */}
      <Player
        autoplay
        loop
        src="CCTV.json" // Replace with the actual path to your Lottie JSON file
        className="w-34 h-32"
      />

      {/* Content */}
      <div className="flex flex-col items-center text-center">


        {/* Paragraph */}
        <p className="text-zinc-400 text-lg max-w-2xl mt-1">
        We showcase the video footage of nearest 6 CCTV Cameras to the Location of Vulnerability detected by using Euclidean Algorithm.
        </p>
      </div>
    </div>
  );
};

const NearestCCTVs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  // Default to a central coordinate if accessed directly without an alert
  const defaultLocality = "Central Command Hub";
  const defaultCoords = "28.7041, 77.1025"; 
  const { coordinates, locality } = state || { coordinates: defaultCoords, locality: defaultLocality };

  const parseCoordinates = (coordsString) => {
    if (coordsString) {
      return coordsString.split(",").map((coord) => parseFloat(coord.trim()));
    }
    return [0, 0];
  };

  const parsedCoordinates = parseCoordinates(coordinates);
  
  // Guard against missing localities import
  const locations = localities || [];

  const [nearestLocations, setNearestLocations] = useState([]);

  // YouTube video links
  const youtubeVideos = [
    "https://www.youtube.com/embed/5_XSYlAfJZM",
    "https://www.youtube.com/embed/1fiF7B6VkCk",
    "https://www.youtube.com/embed/B0YjuKbVZ5w",
    "https://www.youtube.com/embed/3LXQWU67Ufk",
    "https://www.youtube.com/embed/p0Qhe4vhYLQ",
    "https://www.youtube.com/embed/HpZAez2oYsA",
  ];

  useEffect(() => {
    if (parsedCoordinates && locations.length > 0) {
      const calculateDistance = ([lat1, lon1], [lat2, lon2]) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Radius of Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const sortedLocations = locations
        .map((loc) => ({
          ...loc,
          distance: calculateDistance(parsedCoordinates, loc.coordinates),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 6);

      setNearestLocations(sortedLocations);
    }
  }, [state, parsedCoordinates, locality]);

  return (
    <div className="bg-[#0a0a0a] text-zinc-100 min-h-screen relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative z-10">
        <header className="bg-[#0a0a0a]/80 backdrop-blur-xl text-white py-8 border-b border-white/5 sticky top-0 z-20 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Live CCTV Access Network</h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-zinc-400 bg-zinc-900/80 px-4 py-2 rounded-lg border border-white/5 shadow-sm">
              Focus Region: <span className="text-indigo-400 font-semibold ml-1">{locality}</span>
            </p>
            <p className="text-sm text-zinc-400 font-mono bg-zinc-900/80 px-4 py-2 rounded-lg border border-white/5 shadow-sm">
              Current Node: {parsedCoordinates[0].toFixed(4)}, {parsedCoordinates[1].toFixed(4)}
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-[#18181b] border border-white/5 rounded-2xl shadow-sm">
            <div className="flex-1 md:pr-8">
              <h2 className="text-xl font-bold text-white mb-2">Euclidean Geofencing Active</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                We broadcast live video feeds of the nearest 6 active CCTV camera nodes to the location of the detected vulnerability. 
                Spatial proximity mapping is dynamically calculated using Euclidean routing algorithms ensuring immediate on-grid visibility.
              </p>
            </div>
            <div className="flex-shrink-0 mt-6 md:mt-0">
              <Player
                autoplay
                loop
                src="CCTV.json"
                className="w-32 h-32 opacity-90"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {nearestLocations.map((location, index) => (
              <div
                key={location.locality + index}
                className="group relative bg-[#18181b] rounded-2xl border border-white/5 shadow-sm overflow-hidden hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-5 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       {location.locality}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono mt-1.5 flex items-center gap-2">
                      <span className="text-zinc-600">LAT/LNG</span>
                      {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg px-2.5 py-1 text-xs font-mono text-zinc-400 border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                    CH_{String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                <div className="relative w-full aspect-video bg-black/80 overflow-hidden">
                  <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"></div>
                  <iframe
                    src={`${youtubeVideos[index]}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&modestbranding=1&rel=0`}
                    className="object-cover w-full h-full scale-[1.02] transform"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={`video-${index}`}
                  ></iframe>
                  
                  {/* Decorative Scanline */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 z-20 animate-scanline pointer-events-none"></div>
                </div>
                
                <div className="px-5 py-3 bg-zinc-900/30 text-xs text-zinc-500 flex justify-between items-center border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                  </span>
                  <span className="tabular-nums">{(location.distance).toFixed(2)} km away</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NearestCCTVs;

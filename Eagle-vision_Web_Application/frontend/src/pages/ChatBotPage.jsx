import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Player } from "@lottiefiles/react-lottie-player";

function ChatBotPage() {
  const flask_url = import.meta.env.VITE_FLASK_URL || "http://localhost:5010"; // Flask API URL
  const [isLoading, setIsLoading] = useState(false); // Add state
  const [isTyping, setIsTyping] = useState(true); // Add state
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [place, setPlace] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserMessage(transcript); // Set the speech text into the input box
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };


  const fetchCameras = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${flask_url}/getCameras`);
      setCameras(response.data.cameras);
      setIsDropdownOpen(true);
    } catch (error) {
      console.error("Error fetching cameras:", error);
      alert("Failed to fetch cameras. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleCameraSelect = async (event) => {
    const selectedPlace = event.target.value;
    setSelectedCamera(selectedPlace);
    setIsDropdownOpen(false);

    if (selectedPlace) {
      try {
        const videoSrc = `${selectedPlace}.mp4`;
        videoRef.current.src = videoSrc;
        videoRef.current.load();
        await axios.post(`${flask_url}/updateVectorStore`, { place: selectedPlace });
      } catch (error) {
        console.error("Error updating vector store:", error);
        alert("Failed to update vector store. Please try again.");
      }
    }
  };

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!videoFile || !place) {
      alert("Please enter a place and select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("place", place);

    try {
      const response = await axios.post(`${flask_url}/createFlorenceDocument`, formData);

      if (response.status === 200) {
        alert("CCTV registered successfully!");
        setIsPopupOpen(false);
        setPlace("");
        setVideoFile(null);
      } else {
        alert("Failed to register CCTV.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering CCTV.");
    }
  };

  const handleMessageChange = (e) => setUserMessage(e.target.value);



  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setChatHistory((prev) => [...prev, { sender: "user", message: userMessage }]);
    setUserMessage("");
    setIsTyping(true); // Show typing animation

    try {
      const response = await axios.post(`${flask_url}/getResponse`, {
        query: userMessage,
      });
  
      let chatbotMessage = response.data.response;
      let readabletext = response.data.response;
  
      setChatHistory((prev) => [...prev, { sender: "chatbot", message: chatbotMessage }]);
      speakMessage(readabletext);

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsTyping(false); // Hide typing animation
    }
  };
  
  // const handleSendMessage = async () => {
  //   if (!userMessage.trim()) return;

  //   setChatHistory((prev) => [...prev, { sender: "user", message: userMessage }]);

  //   try {
  //     const response = await axios.post(`${flask_url}/getResponse`, {
  //       query: userMessage,
  //     });
  //     let chatbotMessage = response.data.response;
  //     let readabletext = response.data.response;
  //     const timestampRegex = /\d{2}:\d{2}/g;
  //     const matches = chatbotMessage.match(timestampRegex);

  //     if (matches) {
  //       matches.forEach((timestamp) => {
  //         const [minutes, seconds] = timestamp.split(":").map(Number);
  //         const timeInSeconds = minutes * 60 + seconds;
  //         chatbotMessage = chatbotMessage.replace(
  //           timestamp,
  //           `<span class='text-blue-400 cursor-pointer hover:underline' data-time='${timeInSeconds}'>${timestamp}</span>`
  //         );
  //       });
  //     }
  //     setChatHistory((prev) => [...prev, { sender: "chatbot", message: chatbotMessage }]);
  //     setUserMessage("");

  //     // Speak the chatbot's message
  //     speakMessage(readabletext);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Failed to send message. Please try again.");
  //   }
  // };

  const speakMessage = (message) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-speech is not supported in this browser.");
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const renderMessage = (msg) => {
    if (!msg) return null;
    const parts = msg.split(/(\d{2}:\d{2})/g);
    return parts.map((part, index) => {
      if (/\d{2}:\d{2}/.test(part)) {
        const [minutes, seconds] = part.split(":").map(Number);
        const timeInSeconds = minutes * 60 + seconds;
        return (
          <span
            key={index}
            className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors font-mono underline underline-offset-2"
            data-time={timeInSeconds}
            onClick={() => handleTimestampClick(timeInSeconds)}
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleTimestampClick = (timeInSeconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSeconds;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-[#0a0a0a] p-6 space-y-6 lg:space-y-0 lg:space-x-8 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="flex flex-col items-center flex-1 relative z-10">
        <div className="text-3xl font-bold tracking-tight text-white mb-4">
          SentinelIQ
        </div>

        <Player autoplay loop src="Chatbot.json" className="w-48 h-48 my-4" />
        <p className="text-zinc-300 text-lg max-w-md text-center bg-zinc-900/80 px-6 py-3 rounded-xl border border-white/10 shadow-sm">Hey! I'm Zen, How can I help you?</p>
        <div className="flex space-x-4 mt-6">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-6 py-2.5 rounded-lg border border-white/5 shadow-sm transition-all font-medium" onClick={fetchCameras}>View CCTV Camera</button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg border border-indigo-500/20 shadow-sm transition-all font-medium" onClick={() => setIsPopupOpen(true)}>Register CCTV Camera</button>
        </div>

        {/* CCTV Registration Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-xl w-[28rem] text-white">
              
              <h2 className="text-xl font-bold mb-6 text-white text-center">Register CCTV</h2>

              <label className="text-sm text-zinc-400 font-medium mb-1 block">Location / Place</label>
              <input
                type="text"
                placeholder="e.g. Main Entrance"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-2.5 rounded-lg mb-5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-zinc-600"
              />

              <label className="text-sm text-zinc-400 font-medium mb-1 block">Video Footage (.mp4)</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 rounded-lg mb-8 cursor-pointer focus:ring-1 focus:ring-indigo-500 focus:outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
              />

              <div className="flex justify-between gap-4">
                <button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 font-medium py-2.5 rounded-lg transition-all"
                  onClick={() => setIsPopupOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dropdown for selecting cameras */}
        {isDropdownOpen && cameras.length > 0 && (
          <select className="bg-zinc-900 border border-zinc-700 text-zinc-100 px-4 py-2.5 rounded-lg mb-6 shadow-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer font-medium mt-4" onChange={handleCameraSelect} value={selectedCamera}>
            <option value="" className="bg-zinc-900">Select a Camera</option>
            {cameras.map((camera, index) => (
              <option key={index} value={camera} className="bg-zinc-900">{camera}</option>
            ))}
          </select>
        )}

        <div className={`mt-4 bg-[#18181b] border border-white/5 w-full max-w-2xl ${isChatExpanded ? "h-[500px]" : "h-14"} rounded-xl shadow-lg flex flex-col overflow-hidden transition-all duration-300 cursor-pointer chat-container`} onClick={!isChatExpanded ? () => setIsChatExpanded(true) : undefined}>
          {isChatExpanded ? (
            <>
              <div className="bg-[#18181b] p-4 flex justify-between items-center border-b border-white/5">
                <p className="text-zinc-300 font-semibold text-sm">SentinelIQ Assistant</p>
                <button className="text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 p-1 rounded-md transition-colors flex items-center justify-center w-7 h-7" onClick={(e) => { e.stopPropagation(); setIsChatExpanded(false); }}>✕</button>
              </div>
              <div className="flex-1 p-5 overflow-y-auto flex flex-col space-y-4">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`p-3 rounded-lg text-sm w-fit max-w-[80%] leading-relaxed ${chat.sender === "user" ? "bg-indigo-600 text-white self-end rounded-br-sm" : "bg-zinc-800 border border-white/5 text-zinc-100 self-start rounded-bl-sm"}`}>
                    <p>{renderMessage(chat.message)}</p>
                  </div>
                ))}
                {isTyping && (
                  <div className="self-start bg-zinc-800 border border-white/5 text-zinc-400 p-3 rounded-lg text-sm w-fit max-w-[80%] rounded-bl-sm">
                    <span className="animate-pulse">Zen is typing...</span>
                  </div>
                )}
              </div>
              <div className="bg-[#18181b] p-3 flex items-center gap-2 border-t border-white/5">
                <input className="flex-1 p-2.5 rounded-lg bg-[#0a0a0a] border border-zinc-800 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all text-sm" type="text" value={userMessage} onChange={handleMessageChange} placeholder="Ask Zen about the footage..." />
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-lg transition-all text-sm" onClick={handleSendMessage}>Send</button>
                <button
                  className={`bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 p-2.5 rounded-lg transition-all ${isListening ? "border-rose-500 bg-rose-900/20 text-rose-400" : ""}`}
                  onClick={startListening}
                  disabled={isListening}
                  title="Speak"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </button>
                <button
                  className="bg-zinc-800 hover:bg-rose-900/40 border border-white/5 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 p-2.5 rounded-lg transition-all"
                  onClick={stopSpeaking}
                  title="Stop Audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                </button>
              </div>
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-between px-5 bg-zinc-900/50 hover:bg-zinc-800/80 transition-all">
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                 <p className="text-zinc-300 font-medium text-sm">Ask Zen Assistant</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-center z-10 w-full lg:w-1/2 p-4">
        <div className="relative w-full rounded-xl overflow-hidden border border-white/5 bg-[#18181b] p-1.5 shadow-sm">
          <video ref={videoRef} src="video.mp4" controls className="w-full h-auto rounded-lg bg-black"></video>
        </div>
      </div>
    </div>
  );
}

export default ChatBotPage;

import { useRef } from "react";

const Testing = () => {
  const videoRef = useRef(null);

  const seekToTime = (timeInSeconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSeconds;
      videoRef.current.play();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-zinc-100">
      <video ref={videoRef} src="video.mp4" controls className="w-3/4 max-w-2xl rounded-xl shadow-sm border border-white/5" />
      <p className="mt-6 text-lg text-zinc-300">
        There is a car at
        <span 
          className="text-indigo-400 cursor-pointer ml-2 hover:text-indigo-300 transition-colors font-mono font-medium underline underline-offset-4 decoration-indigo-400/30" 
          onClick={() => seekToTime(5)}
        >
          00:05
        </span>
      </p>
    </div>
  );
};

export default Testing;
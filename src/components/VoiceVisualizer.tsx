import { useEffect, useState } from "react";

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
}

const VoiceVisualizer = ({ isListening, isSpeaking }: VoiceVisualizerProps) => {
  const [bars] = useState(Array.from({ length: 32 }, (_, i) => i));
  
  return (
    <div className="flex items-center justify-center gap-1 h-24">
      {bars.map((bar) => (
        <div
          key={bar}
          className={`w-1 bg-primary rounded-full transition-all duration-300 ${
            isListening || isSpeaking ? "animate-pulse" : ""
          }`}
          style={{
            height: isListening || isSpeaking 
              ? `${Math.random() * 100}%` 
              : "20%",
            animationDelay: `${bar * 50}ms`,
            boxShadow: "0 0 10px hsl(var(--primary))",
          }}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;

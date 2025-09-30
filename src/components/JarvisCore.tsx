import { useEffect, useState } from "react";

interface JarvisCoreProps {
  isActive: boolean;
}

const JarvisCore = ({ isActive }: JarvisCoreProps) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer ring */}
      <div 
        className={`absolute w-full h-full rounded-full border-2 border-primary/30 ${
          isActive ? "animate-spin" : ""
        }`}
        style={{ animationDuration: "20s" }}
      >
        <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-primary jarvis-glow" />
      </div>
      
      {/* Middle ring */}
      <div 
        className={`absolute w-3/4 h-3/4 rounded-full border-2 border-primary/50 ${
          isActive ? "animate-spin" : ""
        }`}
        style={{ animationDuration: "15s", animationDirection: "reverse" }}
      >
        <div className="absolute top-1/2 right-0 w-2 h-2 -mr-1 -mt-1 rounded-full bg-primary jarvis-glow" />
      </div>
      
      {/* Inner ring */}
      <div 
        className={`absolute w-1/2 h-1/2 rounded-full border-2 border-primary ${
          isActive ? "animate-spin" : ""
        }`}
        style={{ animationDuration: "10s" }}
      >
        <div className="absolute bottom-0 left-1/2 w-2 h-2 -ml-1 -mb-1 rounded-full bg-primary jarvis-glow" />
      </div>
      
      {/* Center core */}
      <div className={`w-16 h-16 rounded-full bg-primary/20 border-2 border-primary ${
        isActive ? "animate-pulse-glow" : "jarvis-glow"
      }`}>
        <div className="w-full h-full rounded-full bg-primary/40" />
      </div>
      
      {/* Ripple effect when active */}
      {isActive && (
        <>
          <div className="absolute w-32 h-32 rounded-full border-2 border-primary/30 animate-ripple" />
          <div className="absolute w-32 h-32 rounded-full border-2 border-primary/30 animate-ripple" style={{ animationDelay: "0.5s" }} />
        </>
      )}
    </div>
  );
};

export default JarvisCore;

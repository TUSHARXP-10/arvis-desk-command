import { useEffect, useRef } from "react";
import { User, Cpu } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MessageDisplayProps {
  messages: Message[];
}

const MessageDisplay = ({ messages }: MessageDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-4 p-6 custom-scrollbar"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 ${
            message.role === "user" ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              message.role === "user"
                ? "bg-secondary border border-primary/30"
                : "bg-primary/20 border border-primary jarvis-glow"
            }`}
          >
            {message.role === "user" ? (
              <User className="w-5 h-5" />
            ) : (
              <Cpu className="w-5 h-5" />
            )}
          </div>
          
          <div
            className={`flex-1 p-4 rounded-2xl jarvis-glass max-w-[80%] ${
              message.role === "user"
                ? "border-secondary/50"
                : "border-primary/50"
            }`}
          >
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {message.content}
            </p>
            <span className="text-xs text-muted-foreground mt-2 block">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageDisplay;

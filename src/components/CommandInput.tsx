import { useState, KeyboardEvent } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommandInputProps {
  onSendMessage: (message: string) => void;
  onVoiceToggle: () => void;
  isListening: boolean;
  disabled?: boolean;
}

const CommandInput = ({ onSendMessage, onVoiceToggle, isListening, disabled }: CommandInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-3xl mx-auto">
      <Button
        onClick={onVoiceToggle}
        variant={isListening ? "default" : "secondary"}
        size="icon"
        className={`shrink-0 rounded-full ${
          isListening 
            ? "bg-primary jarvis-glow-strong animate-pulse-glow" 
            : "jarvis-glass border-primary/50"
        }`}
        disabled={disabled}
      >
        <Mic className="w-5 h-5" />
      </Button>
      
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter command or speak..."
        className="jarvis-glass border-primary/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50"
        disabled={disabled}
      />
      
      <Button
        onClick={handleSend}
        size="icon"
        className="shrink-0 rounded-full bg-primary hover:bg-primary/90 jarvis-glow"
        disabled={!input.trim() || disabled}
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default CommandInput;

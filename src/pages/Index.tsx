import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import JarvisCore from "@/components/JarvisCore";
import VoiceVisualizer from "@/components/VoiceVisualizer";
import CommandInput from "@/components/CommandInput";
import MessageDisplay, { Message } from "@/components/MessageDisplay";
import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };

      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          handleMessage(transcript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support voice recognition. Please use Chrome or Edge.",
        variant: "destructive",
      });
    }

    // Welcome message
    if (isActive && messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: "JARVIS systems online. All systems operational. How may I assist you today?",
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        speak(welcomeMessage.content);
      }, 1000);
    }
  }, [isActive]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simple response system (will be replaced with AI)
    setTimeout(() => {
      const responses = [
        "I'm processing your request. Currently running in demo mode without backend AI.",
        "Command received. In a full implementation, this would connect to advanced AI systems.",
        "Understood. This is a demonstration interface. Connect Lovable Cloud for full AI capabilities.",
        "Processing... This prototype showcases the JARVIS interface. Full functionality requires backend integration.",
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, response]);
      speak(response.content);
    }, 1000);
  };

  const toggleVoice = () => {
    if (!isActive) return;
    
    if (isListening && recognition) {
      recognition.stop();
    } else if (recognition) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  const toggleSystem = () => {
    setIsActive(!isActive);
    if (isActive && recognition) {
      recognition.stop();
    }
    
    if (!isActive) {
      toast({
        title: "System Activated",
        description: "JARVIS is now online",
      });
    } else {
      toast({
        title: "System Deactivated",
        description: "JARVIS is now offline",
      });
      setMessages([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary jarvis-glow flex items-center justify-center">
            <span className="text-primary font-bold text-xl">J</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">JARVIS</h1>
            <p className="text-xs text-muted-foreground">
              {isActive ? "System Online" : "System Offline"}
            </p>
          </div>
        </div>

        <Button
          onClick={toggleSystem}
          variant={isActive ? "default" : "secondary"}
          className={`rounded-full ${
            isActive 
              ? "bg-primary jarvis-glow hover:bg-primary/90" 
              : "jarvis-glass border-primary/50"
          }`}
        >
          <Power className={`w-5 h-5 mr-2 ${isActive ? "animate-pulse" : ""}`} />
          {isActive ? "Deactivate" : "Activate"}
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {!isActive ? (
          <div className="text-center space-y-6">
            <JarvisCore isActive={false} />
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                Intelligent Virtual System Operator
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Activate JARVIS to begin voice-controlled system operations and AI-powered assistance
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl flex-1 flex flex-col gap-6">
            {/* Core Visualization */}
            <div className="flex items-center justify-center">
              <JarvisCore isActive={isActive} />
            </div>

            {/* Voice Visualizer */}
            {(isListening || isSpeaking) && (
              <div className="flex justify-center">
                <VoiceVisualizer isListening={isListening} isSpeaking={isSpeaking} />
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 jarvis-glass rounded-3xl overflow-hidden flex flex-col max-h-96">
              <MessageDisplay messages={messages} />
            </div>

            {/* Command Input */}
            <div className="shrink-0">
              <CommandInput
                onSendMessage={handleMessage}
                onVoiceToggle={toggleVoice}
                isListening={isListening}
                disabled={!isActive}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-muted-foreground">
          {isActive ? "Ready for commands" : "Activate system to begin"}
        </p>
      </footer>

    </div>
  );
};

export default Index;

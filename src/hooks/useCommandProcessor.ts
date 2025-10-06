import { useState, useEffect } from 'react';
import { commandRegistry } from '@/services/commandRegistry';
import { registerWebCommands } from '@/commands/webCommands';
import { registerSystemCommands } from '@/commands/systemCommands';

export function useCommandProcessor() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize command system
    registerWebCommands();
    registerSystemCommands();
    setInitialized(true);
    console.log('[JARVIS] Command system initialized');
  }, []);

  const processCommand = async (input: string): Promise<string> => {
    if (!initialized) {
      return "Command system is initializing...";
    }

    // Try to find a matching command by keywords
    const handler = commandRegistry.findByKeywords(input);
    
    if (handler) {
      // Extract parameters (basic implementation)
      const params = extractParams(input, handler.keywords);
      const result = await commandRegistry.execute(handler.name, params);
      
      return result.message;
    }

    // If no command found, return null to let AI handle it
    return null as any;
  };

  const extractParams = (input: string, keywords: string[]): any => {
    // Basic parameter extraction
    // In desktop version, this would be more sophisticated
    const words = input.toLowerCase().split(' ');
    
    // Find app name after "open" keyword
    if (words.includes('open')) {
      const openIndex = words.indexOf('open');
      if (openIndex < words.length - 1) {
        return { appName: words[openIndex + 1] };
      }
    }

    return {};
  };

  const listCommands = () => {
    return commandRegistry.getAllCommands();
  };

  return {
    processCommand,
    listCommands,
    initialized
  };
}

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
      if (handler.category === 'system') {
        const params = extractParams(input, handler.keywords);
        // For system commands, directly execute via Electron's exposed API
        if ((window as any).electronAPI && (window as any).electronAPI.executeCommand) {
          try {
            const result = await (window as any).electronAPI.executeCommand(handler.name, params);
            return `System command executed: ${handler.name}. Output: ${JSON.stringify(result)}`;
          } catch (error) {
            return `Error executing system command: ${handler.name}. Error: ${error.message}`;
          }
        } else {
          return "Electron API not available for system commands.";
        }
      } else {
        // For web commands, use the existing command registry execution
        const params = extractParams(input, handler.keywords);
        const result = await commandRegistry.execute(handler.name, params);
        return result.message;
      }
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

    // Find path after "create folder" keywords
    if (input.toLowerCase().includes('create folder')) {
      const createFolderIndex = input.toLowerCase().indexOf('create folder');
      const pathStartIndex = createFolderIndex + 'create folder'.length;
      const path = input.substring(pathStartIndex).trim();
      if (path) {
        return { path: path };
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

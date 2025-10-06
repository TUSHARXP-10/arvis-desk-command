import { CommandHandler, CommandResult } from '@/types/commands';

/**
 * Command Registry - Plugin System for JARVIS
 * 
 * This modular architecture allows easy extension with desktop capabilities.
 * 
 * TO PORT TO DESKTOP (Electron/Tauri/Python):
 * 1. Replace web-based commands with native system calls
 * 2. Use Node.js 'child_process' or Python 'subprocess' for system commands
 * 3. Add file system access using 'fs' module
 * 4. Implement process management with platform-specific APIs
 */

class CommandRegistry {
  private commands: Map<string, CommandHandler> = new Map();

  register(handler: CommandHandler) {
    this.commands.set(handler.name, handler);
    console.log(`[Registry] Registered command: ${handler.name}`);
  }

  async execute(commandName: string, params?: any): Promise<CommandResult> {
    const handler = this.commands.get(commandName);
    
    if (!handler) {
      return {
        success: false,
        message: `Command '${commandName}' not found`
      };
    }

    try {
      return await handler.execute(params);
    } catch (error) {
      return {
        success: false,
        message: `Error executing ${commandName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  findByKeywords(input: string): CommandHandler | null {
    const lowerInput = input.toLowerCase();
    
    for (const handler of this.commands.values()) {
      if (handler.keywords.some(keyword => lowerInput.includes(keyword))) {
        return handler;
      }
    }
    
    return null;
  }

  getAllCommands(): CommandHandler[] {
    return Array.from(this.commands.values());
  }
}

export const commandRegistry = new CommandRegistry();

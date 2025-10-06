import { CommandHandler } from '@/types/commands';
import { commandRegistry } from '@/services/commandRegistry';

/**
 * Web-based commands (current web app capabilities)
 * These work in the browser environment
 */

const timeCommand: CommandHandler = {
  name: 'get_time',
  description: 'Get current time',
  category: 'web',
  keywords: ['time', 'what time', 'current time'],
  execute: async () => {
    const now = new Date();
    return {
      success: true,
      message: `Current time is ${now.toLocaleTimeString()}`,
      data: { timestamp: now.toISOString() }
    };
  }
};

const dateCommand: CommandHandler = {
  name: 'get_date',
  description: 'Get current date',
  category: 'web',
  keywords: ['date', 'what date', 'today'],
  execute: async () => {
    const now = new Date();
    return {
      success: true,
      message: `Today is ${now.toLocaleDateString()}`,
      data: { date: now.toISOString().split('T')[0] }
    };
  }
};

const weatherCommand: CommandHandler = {
  name: 'get_weather',
  description: 'Get weather information',
  category: 'web',
  keywords: ['weather', 'temperature', 'forecast'],
  execute: async () => {
    return {
      success: true,
      message: 'Weather API would be integrated here. In desktop version, this could call local weather services.',
      data: { note: 'Placeholder for weather API integration' }
    };
  }
};

// Register web commands
export function registerWebCommands() {
  commandRegistry.register(timeCommand);
  commandRegistry.register(dateCommand);
  commandRegistry.register(weatherCommand);
}

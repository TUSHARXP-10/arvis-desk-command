import { CommandHandler } from '@/types/commands';
import { commandRegistry } from '@/services/commandRegistry';

/**
 * System Control Commands - DESKTOP VERSION TEMPLATE
 * 
 * These are placeholders showing the framework structure.
 * In a desktop app (Electron/Tauri/Python), replace with actual system calls:
 * 
 * ELECTRON EXAMPLE:
 * const { exec } = require('child_process');
 * exec('notepad.exe', callback);
 * 
 * PYTHON EXAMPLE:
 * import subprocess
 * subprocess.Popen(['notepad.exe'])
 * 
 * TAURI EXAMPLE:
 * import { Command } from '@tauri-apps/api/shell';
 * const command = Command.create('notepad');
 */

const openAppCommand: CommandHandler = {
  name: 'open_application',
  description: 'Open an application',
  category: 'system',
  keywords: ['open', 'launch', 'start', 'run'],
  execute: async (params: { appName: string }) => {
    // WEB VERSION: Limited capability
    const webApps: Record<string, string> = {
      'youtube': 'https://youtube.com',
      'gmail': 'https://gmail.com',
      'github': 'https://github.com',
    };

    if (webApps[params.appName.toLowerCase()]) {
      window.open(webApps[params.appName.toLowerCase()], '_blank');
      return {
        success: true,
        message: `Opening ${params.appName} in browser`,
      };
    }

    return {
      success: false,
      message: `Desktop version needed to open ${params.appName}. In Electron/Tauri, use: exec('${params.appName}.exe')`,
    };
  }
};

const systemInfoCommand: CommandHandler = {
  name: 'system_info',
  description: 'Get system information',
  category: 'system',
  keywords: ['system', 'info', 'specs', 'cpu', 'memory'],
  execute: async () => {
    // WEB VERSION: Limited info
    const info = {
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      language: navigator.language,
      online: navigator.onLine,
      cookiesEnabled: navigator.cookieEnabled,
    };

    return {
      success: true,
      message: 'Browser info retrieved. Desktop version would show CPU, RAM, disk space, etc.',
      data: info
    };
  }
};

const fileOperationCommand: CommandHandler = {
  name: 'file_operation',
  description: 'File system operations',
  category: 'system',
  keywords: ['file', 'folder', 'directory', 'create', 'delete', 'move'],
  execute: async (params: { operation: string; path: string }) => {
    return {
      success: false,
      message: `File operations require desktop app. Would execute: ${params.operation} on ${params.path}`,
      data: {
        template: `
        // Desktop implementation:
        const fs = require('fs');
        fs.${params.operation}('${params.path}', callback);
        `
      }
    };
  }
};

const processControlCommand: CommandHandler = {
  name: 'process_control',
  description: 'Control system processes',
  category: 'system',
  keywords: ['process', 'task', 'kill', 'close', 'end'],
  execute: async (params: { action: string; processName: string }) => {
    return {
      success: false,
      message: `Process control requires desktop app. Would ${params.action} process: ${params.processName}`,
      data: {
        template: `
        // Desktop implementation:
        exec('taskkill /IM ${params.processName} /F', callback);
        `
      }
    };
  }
};

// Register system commands
export function registerSystemCommands() {
  commandRegistry.register(openAppCommand);
  commandRegistry.register(systemInfoCommand);
  commandRegistry.register(fileOperationCommand);
  commandRegistry.register(processControlCommand);
}

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
    // Check if running in Electron 
    if (window.electronAPI?.isElectron) {
      // Use Electron API 
      const result = await window.electronAPI.executeCommand('open_application', params);
      return result;
    }
     
    // Fallback to web version (limited capability) 
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
      message: `Electron API not available for system commands. Please run in Electron desktop app.`,
    };
  }
};

const fileOperationCommand: CommandHandler = {
  name: 'file_operation',
  description: 'File system operations',
  category: 'system',
  keywords: ['file', 'folder', 'directory', 'create', 'delete', 'move'],
  execute: async (params: { operation: string; path: string }) => {
    if (window.electronAPI?.isElectron) {
      const result = await window.electronAPI.executeCommand('file_operation', params);
      return result;
    }
    return {
      success: false,
      message: `File operations require desktop app.`,
    };
  }
};

const createFolderCommand: CommandHandler = {
  name: 'create_folder',
  description: 'Create a new folder',
  category: 'system',
  keywords: ['create folder', 'make directory', 'new folder'],
  execute: async (params: { path: string }) => {
    if (window.electronAPI?.isElectron) {
      const result = await window.electronAPI.executeCommand('create_folder', params);
      return result;
    }
    return {
      success: false,
      message: `Folder creation requires desktop app.`,
    };
  }
};

const processControlCommand: CommandHandler = {
  name: 'process_control',
  description: 'Control system processes',
  category: 'system',
  keywords: ['process', 'task', 'kill', 'close', 'end'],
  execute: async (params: { action: string; processName: string }) => {
    if (window.electronAPI?.isElectron) {
      const result = await window.electronAPI.executeCommand('process_control', params);
      return result;
    }
    return {
      success: false,
      message: `Process control requires desktop app.`,
    };
  }
};

const systemInfoCommand: CommandHandler = {
  name: 'system_info',
  description: 'Get system information',
  category: 'system',
  keywords: ['system', 'info', 'information', 'specs'],
  execute: async () => {
    if (window.electronAPI?.isElectron) {
      const result = await window.electronAPI.executeCommand('system_info', {});
      return result;
    }
    return {
      success: false,
      message: `System information requires desktop app.`,
    };
  }
};

// Register system commands
export function registerSystemCommands() {
  commandRegistry.register(openAppCommand);
  commandRegistry.register(fileOperationCommand);
  commandRegistry.register(createFolderCommand);
  commandRegistry.register(processControlCommand);
  commandRegistry.register(systemInfoCommand);
}

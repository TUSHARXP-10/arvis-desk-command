// Command System Types - Framework for extending JARVIS capabilities

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface CommandHandler {
  name: string;
  description: string;
  category: 'system' | 'application' | 'web' | 'custom';
  keywords: string[];
  execute: (params: any) => Promise<CommandResult>;
}

export interface SystemCommand {
  type: 'SYSTEM_INFO' | 'OPEN_APP' | 'FILE_OPERATION' | 'PROCESS_CONTROL' | 'NETWORK' | 'CUSTOM';
  action: string;
  params?: Record<string, any>;
}

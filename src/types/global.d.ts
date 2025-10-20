interface ElectronAPI {
  executeCommand: (command: string, params: any) => Promise<any>;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};

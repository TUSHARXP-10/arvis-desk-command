# JARVIS Desktop Implementation Guide

This framework is designed to be easily ported to a desktop application using Electron, Tauri, or Python.

## Architecture Overview

The command system is built with a plugin architecture:

```
src/
├── types/commands.ts          # Type definitions
├── services/commandRegistry.ts # Command registry & router
├── commands/
│   ├── webCommands.ts         # Web-based commands (current)
│   ├── systemCommands.ts      # System control templates
│   └── [custom commands]      # Add your own!
└── hooks/useCommandProcessor.ts # React integration
```

## Desktop Implementation Options

### Option 1: Electron (Node.js + Web Technologies)

**Pros:** Reuse existing React UI, powerful Node.js backend
**Best for:** Full-featured desktop app with web UI

```javascript
// In Electron main process
const { exec } = require('child_process');

// Replace system command implementations
const openAppCommand = {
  execute: async (params) => {
    exec(`start ${params.appName}`, (error) => {
      if (error) return { success: false, message: error.message };
      return { success: true, message: `Opened ${params.appName}` };
    });
  }
};
```

### Option 2: Tauri (Rust + Web Technologies)

**Pros:** Smaller bundle size, better performance, enhanced security
**Best for:** Lightweight desktop app with web UI

```rust
// In Tauri command
#[tauri::command]
fn open_application(app_name: String) -> Result<String, String> {
    std::process::Command::new(&app_name)
        .spawn()
        .map(|_| format!("Opened {}", app_name))
        .map_err(|e| e.to_string())
}
```

### Option 3: Python (PyQt/Tkinter)

**Pros:** Easy system integration, extensive libraries
**Best for:** AI-heavy apps, quick prototypes

```python
import subprocess

class CommandHandler:
    def open_application(self, app_name):
        try:
            subprocess.Popen([app_name])
            return {"success": True, "message": f"Opened {app_name}"}
        except Exception as e:
            return {"success": False, "message": str(e)}
```

## System Capabilities to Add

### 1. Process Control
```javascript
// List processes
exec('tasklist', callback);

// Kill process
exec('taskkill /IM notepad.exe /F', callback);

// Monitor CPU/RAM
const os = require('os');
os.cpus(); // CPU info
os.freemem(); // Available memory
```

### 2. File Operations
```javascript
const fs = require('fs');

// Create file
fs.writeFile('path/to/file', 'content', callback);

// Delete file
fs.unlink('path/to/file', callback);

// Move file
fs.rename('old/path', 'new/path', callback);
```

### 3. Application Launching
```javascript
// Windows
exec('start chrome https://google.com');

// macOS
exec('open -a "Google Chrome" https://google.com');

// Linux
exec('google-chrome https://google.com');
```

### 4. System Information
```javascript
const os = require('os');
const si = require('systeminformation'); // npm package

// Get system info
const info = {
  platform: os.platform(),
  arch: os.arch(),
  cpus: os.cpus(),
  totalMem: os.totalmem(),
  freeMem: os.freemem(),
  uptime: os.uptime()
};

// Detailed info with systeminformation
si.cpu().then(data => console.log(data));
si.graphics().then(data => console.log(data));
```

### 5. Keyboard/Mouse Control (Advanced)
```javascript
const robot = require('robotjs'); // npm package

// Type text
robot.typeString("Hello World");

// Move mouse
robot.moveMouse(x, y);

// Click
robot.mouseClick();
```

## Migration Steps

1. **Choose Platform:** Pick Electron, Tauri, or Python
2. **Setup Project:** Initialize desktop app boilerplate
3. **Port UI:** Copy React components (Electron/Tauri) or rebuild (Python)
4. **Implement Commands:** Replace placeholder commands in `systemCommands.ts`
5. **Add Native Bridge:** Connect UI to system calls
6. **Security:** Implement permissions & sandboxing
7. **Test:** Thoroughly test all system interactions

## Security Considerations

⚠️ **IMPORTANT:** Desktop apps have full system access

- Always validate user input
- Implement permission system
- Sandbox dangerous operations
- Log all system commands
- Add confirmation for destructive actions
- Never execute arbitrary code from user input

## Example: Complete Electron Setup

```javascript
// main.js - Electron main process
const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');

// Create window
let win;
app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('dist/index.html');
});

// System commands
ipcMain.handle('execute-command', async (event, command, params) => {
  switch(command) {
    case 'open_application':
      return new Promise((resolve) => {
        exec(`start ${params.appName}`, (error) => {
          if (error) resolve({ success: false, message: error.message });
          else resolve({ success: true, message: `Opened ${params.appName}` });
        });
      });
    
    case 'system_info':
      const os = require('os');
      return {
        success: true,
        data: {
          platform: os.platform(),
          arch: os.arch(),
          cpus: os.cpus().length,
          totalMem: Math.round(os.totalmem() / 1024 / 1024 / 1024) + ' GB'
        }
      };
    
    default:
      return { success: false, message: 'Unknown command' };
  }
});
```

```javascript
// preload.js - Bridge between renderer and main
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  executeCommand: (command, params) => 
    ipcRenderer.invoke('execute-command', command, params)
});
```

```typescript
// Update commandRegistry.ts to use Electron API
async execute(commandName: string, params?: any): Promise<CommandResult> {
  if (window.electronAPI) {
    // Desktop mode - use Electron
    return await window.electronAPI.executeCommand(commandName, params);
  } else {
    // Web mode - use existing handlers
    const handler = this.commands.get(commandName);
    return handler ? await handler.execute(params) : { success: false, message: 'Command not found' };
  }
}
```

## Next Steps

1. Test this framework in the browser (works now with limited web APIs)
2. Choose your desktop platform (Electron recommended for easiest port)
3. Export this project to your local machine
4. Follow migration steps above
5. Implement native system commands
6. Add security layer
7. Test thoroughly

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Tauri Documentation](https://tauri.app/v1/guides/)
- [RobotJS for automation](http://robotjs.io/)
- [systeminformation npm](https://www.npmjs.com/package/systeminformation)

## Contact & Support

This is a starting framework. You'll need to:
- Handle OS-specific differences (Windows/Mac/Linux)
- Implement proper error handling
- Add security & permissions
- Create comprehensive command parser
- Build natural language understanding for complex commands

Good luck building your desktop JARVIS! 🚀

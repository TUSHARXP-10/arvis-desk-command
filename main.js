import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow () {
  console.log('Creating window...');
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  console.log('Window created, preload path:', path.join(__dirname, 'preload.js'));
  console.log('Preload file exists:', fs.existsSync(path.join(__dirname, 'preload.js')));

  // Load the React app
  // Ensure that if NODE_ENV is not explicitly 'production', it loads from the development server.
  // This handles cases where NODE_ENV might be undefined or not strictly 'development' during dev setup.
  if (process.env.NODE_ENV !== 'production') {
    console.log('Loading in development mode from localhost:3030');
    mainWindow.loadURL('http://localhost:3030');
  } else {
    console.log('Loading in production mode from dist/index.html');
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    console.log('Loading file from:', indexPath);
    console.log('File exists:', fs.existsSync(indexPath));
    mainWindow.loadFile(indexPath);
  }

  return mainWindow;
}

app.whenReady().then(() => {
  app.setPath('userData', path.join(app.getPath('appData'), 'JARVIS-Desk-Command'));
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('execute-command', async (event, command, params) => {
  switch(command) {
    case 'open_application':
      return new Promise((resolve) => {
        // Map common app names to executables
        const appMap = {
          'notepad': 'C:\\Windows\\System32\\notepad.exe',
          'calculator': 'calc.exe',
          'chrome': 'chrome.exe',
          'explorer': 'explorer.exe'
        };
         
        const appExe = appMap[params.appName.toLowerCase()] || `${params.appName}.exe`;
         
        exec(appExe, (error) => {
          if (error) {
            resolve({ 
              success: false, 
              message: `Failed to open ${params.appName}: ${error.message}` 
            });
          } else {
            resolve({ 
              success: true, 
              message: `Successfully opened ${params.appName}` 
            });
          }
        });
      });
       
    case 'create_folder':
      return new Promise((resolve) => {
        const folderPath = params.path;
        if (!folderPath) {
          return resolve({ success: false, message: 'Folder path is required.' });
        }
        fs.mkdir(folderPath, { recursive: true }, (err) => {
          if (err) {
            resolve({ success: false, message: `Failed to create folder: ${err.message}` });
          } else {
            resolve({ success: true, message: `Folder created successfully at ${folderPath}` });
          }
        });
      });

    case 'system_info':
      return {
        success: true,
        message: 'System information retrieved',
        data: {
          platform: os.platform(),
          arch: os.arch(),
          cpus: os.cpus().length,
          totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + ' GB',
          freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024) + ' GB'
        }
      };
       
    default:
      return { success: false, message: 'Unknown command' };
  }
});
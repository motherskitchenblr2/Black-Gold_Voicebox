import { QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';
import { queryClient } from './lib/queryClient';
import { PlatformProvider } from './platform/PlatformContext';
import type { Platform } from './platform/types';

// Create a web fallback platform for non-Tauri environments
const createWebPlatform = (): Platform => ({
  filesystem: {
    saveFile: async () => {
      console.log('[Web Platform] saveFile not available in web mode');
    },
    openPath: async () => {
      console.log('[Web Platform] openPath not available in web mode');
    },
    pickDirectory: async () => null,
  },
  updater: {
    checkForUpdates: async () => {
      console.log('[Web Platform] Automatic updates managed by hosting platform');
    },
    downloadAndInstall: async () => {},
    restartAndInstall: async () => {},
    getStatus: () => ({
      checking: false,
      available: false,
      downloading: false,
      installing: false,
      readyToInstall: false,
    }),
    subscribe: () => () => {},
  },
  audio: {
    isSystemAudioSupported: async () => false,
    startSystemAudioCapture: async () => {},
    stopSystemAudioCapture: async () => new Blob(),
    listOutputDevices: async () => [],
    playToDevices: async () => {},
    stopPlayback: () => {},
  },
  lifecycle: {
    startServer: async () => 'http://127.0.0.1:17493',
    stopServer: async () => {},
    restartServer: async () => 'http://127.0.0.1:17493',
    setKeepServerRunning: async () => {},
    setupWindowCloseHandler: async () => {},
    subscribeToServerLogs: () => () => {},
  },
  metadata: {
    getVersion: async () => '0.5.0',
    isTauri: false,
  },
});

const webPlatform = createWebPlatform();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PlatformProvider platform={webPlatform}>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </PlatformProvider>
  </React.StrictMode>,
);

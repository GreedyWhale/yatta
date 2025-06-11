import type { UserConfig } from 'wxt';

import os from 'node:os';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'wxt';


const config: UserConfig = {
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    name: 'Yatta',
    description: 'やったー！',
    version: '1.0.0',
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
};

if (os.platform() === 'win32') {
  config.webExt = {
    binaries: {
      chrome: "C:\\Users\\Administrator\\chrome\\win64-137.0.7151.68\\chrome-win64\\chrome.exe"
    }
  }
}

// See https://wxt.dev/api/config.html
export default defineConfig(config);
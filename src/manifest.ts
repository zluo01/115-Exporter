import type { Manifest } from 'webextension-polyfill';

import pkg from '../package.json';

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: 'Helper to download files from 115 using Aria2',
  icons: {
    '192': 'logo192.png',
  },
  permissions: ['cookies', 'storage', 'notifications'],
  host_permissions: ['*://*.115.com/*'],
  background: {
    scripts: ['background/index.js'],
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['*://*.115.com/*'],
      js: ['content/index.js'],
      css: ['contentStyle.css'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['contentStyle.css', 'logo192.png'],
      matches: ['*://*.115.com/*'],
    },
  ],
  options_ui: {
    page: 'options.html',
  },
  browser_specific_settings: {
    gecko: {
      id: 'zluo01@github.com',
    },
  },
};

export default manifest;

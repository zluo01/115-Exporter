# 115 File Exporter
Simple Extension to allow users to download file directly from 115 through aria2 instead of dedicated clients.

## Build
```
npm run complete
```

## Installation
### Firefox
 - Unpack the zip and load the manifest file under debug addon mode.
 - Submit as personal add-on

### Chrome/Chromium
Change 

```
  "background": {
    "scripts": [
      "background/index.js"
    ],
    "type": "module"
  },
```
to
```
  "background": {
    "service_worker": "background/index.js",
    "type": "module"
  },
```

Then either load the folder as unpack or zip it and load as packed.

## Permission

### Firefox
Users need to grant permissions for this plugin under permission tab in extension management page.

## Reference
 - https://github.com/acgotaku/115
 - https://github.com/sonnyp/aria2.js

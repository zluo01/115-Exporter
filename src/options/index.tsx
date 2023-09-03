import React from 'react';
import { createRoot } from 'react-dom/client';

import Setting from './Setting';
import './index.css';

const rootContainer = document.getElementById('root');

if (!rootContainer) throw new Error("Can't find Options root element");

const root = createRoot(rootContainer);

root.render(
  <React.StrictMode>
    <Setting />
  </React.StrictMode>,
);

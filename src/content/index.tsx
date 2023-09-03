import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';

const iframe = document.querySelector('iframe[rel="wangpan"]');

if (!iframe) {
  throw new Error("Can't find iframe element.");
}

const body = document.querySelector('body');

if (!body) {
  throw new Error("Can't find body.");
}

const app = document.createElement('div');

app.id = 'root';

body.prepend(app);

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

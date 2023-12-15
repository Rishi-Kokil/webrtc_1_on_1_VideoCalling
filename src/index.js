import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";

import { SocketProvider } from './Providers/Socket';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);



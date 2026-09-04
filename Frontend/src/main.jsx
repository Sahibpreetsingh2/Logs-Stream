import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { LogFilterProvider } from './context/LogFilterContext.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LogFilterProvider>
        <App />
      </LogFilterProvider>
    </BrowserRouter>
  </React.StrictMode>
);

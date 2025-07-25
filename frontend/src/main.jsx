
import axios from 'axios';
import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import './index.css';
import ScrollToTop from './features/ScrollToTop';
import Dashboard from './Dashboard.jsx'
axios.defaults.withCredentials = true;

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop/>
      <App/>
      <Dashboard />
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

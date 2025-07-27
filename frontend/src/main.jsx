import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import './index.css';
import ScrollToTop from './features/ScrollToTop';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop/>
      <App/>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

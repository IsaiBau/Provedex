import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MyStyledCalendar from '../src/assets/Calendar.jsx'
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import './index.css';
import ScrollToTop from './features/ScrollToTop';
import Dashboard from './Dashboard.jsx'

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

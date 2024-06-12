import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import {MswOverviewPage} from './overview/MswOverviewPage';
import {MswLogin} from './user/login/MswLogin';
import {ApiConfigurationInitialization} from './api/config/AuthConfiguration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiConfigurationInitialization></ApiConfigurationInitialization>
      <Routes>
        <Route path="/spots" element={<MswOverviewPage />} />
        <Route path="/login" element={<MswLogin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

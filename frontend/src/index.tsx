import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import {MswLogin} from './user/login/MswLogin';
import {UserAuthContextProvider} from './user/UserAuthContext';
import {MswOverviewPage} from './overview/MswOverviewPage';
import MswSignUp from './user/signup/MswSignUp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <UserAuthContextProvider>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/spots"/>}/>
          <Route path="/login" element={<MswLogin/>}/>
          <Route path="/signup" element={<MswSignUp/>}/>
          <Route path="/spots" element={<MswOverviewPage/>}/>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </UserAuthContextProvider>,
);

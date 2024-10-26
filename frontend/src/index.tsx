import "./index.scss"
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import {UserAuthContextProvider} from './user/UserAuthContext';
import {MswOverviewPage} from './overview/MswOverviewPage';
import {ErrorNotFound} from "./error/404";
import {MswForgotPassword} from "./user/forgot-password/MswForgotPassword";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

root.render(
    <UserAuthContextProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/spots"/>}/>
                <Route path="/forgot-password" element={<MswForgotPassword/>}/>
                <Route path="/spots" element={<MswOverviewPage/>}/>

                <Route path="*" element={<ErrorNotFound/>}/>
            </Routes>
        </BrowserRouter>
    </UserAuthContextProvider>,
);

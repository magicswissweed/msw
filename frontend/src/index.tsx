import "./index.scss"
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import {MswLogin} from './user/login/MswLogin';
import {UserAuthContextProvider} from './user/UserAuthContext';
import {MswOverviewPage} from './overview/MswOverviewPage';
import MswSignUp from './user/signup/MswSignUp';
import {MswAddSpot} from './spot/add/MswAddSpot';
import {ErrorNotFound} from "./error/404";

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
                    <Route path="/spots/add" element={<MswAddSpot/>}/>

                    <Route path="*" element={<ErrorNotFound/>}/>
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    </UserAuthContextProvider>,
);

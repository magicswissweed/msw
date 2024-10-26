import './MswHeader.scss'
import React from 'react';
import {useUserAuth} from '../user/UserAuthContext';
import {MswAddSpot} from "../spot/add/MswAddSpot";
import {MswLogin} from "../user/login/MswLogin";
import MswSignUp from "../user/signup/MswSignUp";

export const MswHeader = () => {
    // @ts-ignore
    const {user, logOut} = useUserAuth();

    let loginOrLogout: JSX.Element;
    if (user) {
        loginOrLogout = <>
            <MswAddSpot />
            <button className="logout msw-button" onClick={logOut}>Logout</button>
        </>
    } else {
        loginOrLogout = <>
            <MswLogin />
            <MswSignUp />
        </>
    }

    return <>
        <header className="App-header">
            <div className="loginOrLogoutContainer">
                {loginOrLogout}
            </div>
            <div className="title">
                <h1>MagicSwissWeed</h1>
                <p>Current surfing conditions in Switzerland</p>
            </div>
        </header>
    </>;
}
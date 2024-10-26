import './MswHeader.scss'
import React from 'react';
import {Link} from 'react-router-dom';
import {useUserAuth} from '../user/UserAuthContext';
import {MswAddSpot} from "../spot/add/MswAddSpot";

export const MswHeader = () => {
    // @ts-ignore
    const {user, logOut} = useUserAuth();

    let loginOrLogout: JSX.Element;
    if (user) {
        loginOrLogout = <>
            <MswAddSpot></MswAddSpot>
            <button className="logout msw-button" onClick={logOut}>Logout</button>
        </>
    } else {
        loginOrLogout = <>
            <Link className="login msw-button" to="/login">Log in</Link>
            <Link className="signup msw-button" to="/signup">Sign up</Link>
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
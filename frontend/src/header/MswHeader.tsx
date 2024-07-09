import './MswHeader.scss'
import React from 'react';
import {Link} from 'react-router-dom';
import {useUserAuth} from '../user/UserAuthContext';

export const MswHeader = () => {
    // @ts-ignore
    const {user, logOut} = useUserAuth();

    let loginOrLogout: JSX.Element;
    if (user) {
        loginOrLogout = <>
            <Link className="add-spot msw-button" to={'/spots/add'}>Add Spot</Link>
            <button id="login-Button" className="logout msw-button" onClick={logOut}>Logout</button>
        </>
    } else {
        loginOrLogout = <>
            <Link id="login-Button" className="login msw-button" to="/login">Log in</Link>
            <Link id="login-Button" className="signup msw-button" to="/signup">Sign up</Link>
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
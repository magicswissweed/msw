import './MswHeader.scss'
import React, {useState} from 'react';
import {useUserAuth} from '../user/UserAuthContext';
import {MswAddSpot} from "../spot/add/MswAddSpot";
import {MswLoginModal} from "../user/login/MswLoginModal";
import MswSignUpModal from "../user/signup/MswSignUp";
import {MswForgotPassword} from "../user/forgot-password/MswForgotPassword";

export const MswHeader = () => {
    // @ts-ignore
    const {user, logOut} = useUserAuth();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    let loginOrLogout: JSX.Element;

    if (user) {
        loginOrLogout = <>
            <MswAddSpot/>
            <button className="logout msw-button" onClick={logOut}>Logout</button>
        </>
    } else {
        loginOrLogout = <>
            <button className="msw-button" onClick={() => setShowLoginModal(true)}>Login</button>
            <button className="msw-button" onClick={() => setShowSignupModal(true)}>Sign up</button>
            <MswLoginModal isOpen={showLoginModal}
                           closeModal={() => setShowLoginModal(false)}
                           openSignupModal={() => setShowSignupModal(true)}
                           openForgotPasswordModal={() => setShowForgotPasswordModal(true)} />
            <MswSignUpModal isOpen={showSignupModal}
                            closeModal={() => setShowSignupModal(false)}
                            openLoginModal={() => setShowLoginModal(true)}/>
            <MswForgotPassword isOpen={showForgotPasswordModal}
                               closeModal={() => setShowForgotPasswordModal(false)}
                               openLoginModal={() => setShowLoginModal(true)}/>
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
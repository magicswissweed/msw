import './MswHeader.scss'
import React, {useState} from 'react';
import {useUserAuth} from '../user/UserAuthContext';
import {MswAddSpot} from "../spot/add/MswAddSpot";
import {MswLoginModal} from "../user/login/MswLoginModal";
import MswSignUpModal from "../user/signup/MswSignUp";

export const MswHeader = () => {
    // @ts-ignore
    const {user, logOut} = useUserAuth();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    let loginOrLogout: JSX.Element;

    function openLoginModal() {
        setShowLoginModal(true);
    }

    function closeLoginModal() {
        setShowLoginModal(false);
    }

    function openSignupModal() {
        setShowSignupModal(true);
    }

    function closeSignupModal() {
        setShowSignupModal(false);
    }

    if (user) {
        loginOrLogout = <>
            <MswAddSpot/>
            <button className="logout msw-button" onClick={logOut}>Logout</button>
        </>
    } else {
        loginOrLogout = <>
            <button className="msw-button" onClick={openLoginModal}>Login</button>
            <button className="msw-button" onClick={openSignupModal}>Sign up</button>
            <MswLoginModal isOpen={showLoginModal} closeModal={closeLoginModal} openSignupModal={openSignupModal} />
            <MswSignUpModal isOpen={showSignupModal} closeModal={closeSignupModal} openLoginModal={openLoginModal}/>
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
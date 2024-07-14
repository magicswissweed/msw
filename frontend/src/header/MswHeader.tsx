import "./MswHeader.scss";
import React from "react";
import { useUserAuth } from "../user/UserAuthContext";
import { Button } from "react-bootstrap";

export const MswHeader = () => {
    // @ts-ignore
    const { user, logOut } = useUserAuth();

    let loginOrLogout: JSX.Element;
    if (user) {
        loginOrLogout = (
            <>
                <Button variant="outline-primary" href="/spots/add">
                    Add Spot
                </Button>
                <Button variant="outline-primary" onClick={logOut}>
                    Sign Out
                </Button>
            </>
        );
    } else {
        loginOrLogout = (
            <>
                <Button variant="outline-primary" href="/login">
                    Log In
                </Button>
                <Button variant="outline-primary" href="/signup">
                    Sign Up
                </Button>
            </>
        );
    }

    return (
        <>
            <header className="App-header">
                <div className="title">
                    <h1>magicswissweed</h1>
                    <p>The surf forecast for Switzerland</p>
                </div>
                <div className="loginOrLogoutContainer">{loginOrLogout}</div>
            </header>
        </>
    );
};

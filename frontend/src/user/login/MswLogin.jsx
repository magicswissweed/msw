import '../user.scss'
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Alert, Button, Form} from "react-bootstrap";
import {useUserAuth} from "../UserAuthContext";

export const MswLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {logIn, googleSignIn} = useUserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await logIn(email, password)
            navigate("/spots")
        } catch (err) {
            if (err.message.includes('auth/invalid-credential')) {
                setError('Wrong email or password.');
            } else if (err.message.includes('auth/invalid-email')) {
                setError('Wrong email.');
            } else if (err.message.includes('auth/missing-passwordl')) {
                setError('Please provide a password.');
            } else {
                setError(err.message);
            }
        }
    };

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        try {
            await googleSignIn();
            navigate("/spots");
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <>
            <div className="form">
                <div className="box-container">
                    <div className="p-4 box">
                        <h2 className="mb-3">Login</h2>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    type="email"
                                    placeholder="Email address"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="Submit">
                                    Log In
                                </Button>
                            </div>
                        </Form>
                        <hr/>
                        {/*<div className="google-button-container">*/}
                        {/*    <GoogleButton*/}
                        {/*        type="dark"*/}
                        {/*        onClick={handleGoogleSignIn}*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>
                    <div className="p-4 box mt-3 text-center">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </>
    );
};
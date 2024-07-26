import '../user.scss';
import './MswLogin.scss';
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Alert, Button, Form} from "react-bootstrap";
import {useUserAuth, firebaseUiConfig} from "../UserAuthContext";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import { firebaseAuth } from '../../firebase/FirebaseConfig';


export const MswLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {logIn} = useUserAuth();
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
            } else if (err.message.includes('auth/missing-password')) {
                setError('Please provide a password.');
            } else {
                setError(err.message);
            }
        }
    };

    // firebaseUI login
    useEffect(() => {
  
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseAuth);
      ui.start('#firebaseui-auth-container', firebaseUiConfig);
  
      return () => {
        ui.reset();
      };
    }, []);

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
                            <Link className="forgot-password" to="/forgot-password">Forgot Password?</Link>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="Submit">
                                    Log In
                                </Button>
                            </div>
                        </Form>
                        <hr/>
                        <p className='text-center'>or</p>
                        <div id="firebaseui-auth-container"></div>
                    </div>
                    <div className="p-4 box mt-3 text-center">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </>
    );
};
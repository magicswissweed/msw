import '../user.scss'
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Alert, Button, Form} from "react-bootstrap";
import {useUserAuth, firebaseUiConfig} from "../UserAuthContext";
import * as firebaseui from "firebaseui";
import { firebaseAuth } from '../../firebase/FirebaseConfig';

const MswSignup = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const {signUp} = useUserAuth();
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signUp(email, password);
            navigate("/");
        } catch (err) {
            if (err.message.includes('auth/email-already-in-use')) {
                setError('This email is already registered. Please try to log in.');
            } else if (err.message.includes('auth/weak-password')) {
                setError('Password should have at least 6 Characters.')
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
                        <h2 className="mb-3">Signup</h2>

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
                                    Sign up
                                </Button>
                            </div>
                        </Form>
                        <hr/>
                        <p className='text-center'>or</p>
                        <div id="firebaseui-auth-container"></div>
                    </div>
                    <div className="p-4 box mt-3 text-center">
                        Already have an account? <Link to="/login">Log In</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MswSignup;
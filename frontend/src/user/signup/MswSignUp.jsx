import './MswSignUp.scss';
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import {useUserAuth} from "../UserAuthContext";

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
                setError('<p>This email is already registered. Please try to log in <a href="/login">here</a>.</p>');
            } else if (err.message.includes('auth/weak-password')) {
                setError('Password should have at least 6 Characters.')
            } else {
                setError(err.message);
            }
        }
    };

    return (
        <>
            <div className="form">
                <div className="box-container">
                    <div className="p-4 box">
                        <h2 className="mb-3">Signup</h2>

                        {error && <p className="error-message" dangerouslySetInnerHTML={{ __html: error }}></p>}

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
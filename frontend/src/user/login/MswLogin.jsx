import "../user.scss";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { useUserAuth } from "../UserAuthContext";
import { MswHeader } from "../../header/MswHeader";
import { MswFooter } from "../../footer/MswFooter";

export const MswLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { logIn, googleSignIn } = useUserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await logIn(email, password).then(() => {
                navigate("/spots");
            });
        } catch (err) {
            setError(err.message);
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
            <div className="App">
                <MswHeader />
                <div className="form">
                    <div className="box-container">
                        <div className="p-2 box">
                            <h2 className="mb-3">Login</h2>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicEmail"
                                >
                                    <Form.Control
                                        type="email"
                                        placeholder="Email address"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </Form.Group>

                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="Submit">
                                        Log In
                                    </Button>
                                    {/* <button
                                        class="btn btn-msw-primary"
                                        type="submit"
                                    >
                                        Log In
                                    </button> */}
                                </div>
                            </Form>
                            <hr />
                            {/*<div className="google-button-container">*/}
                            {/*    <GoogleButton*/}
                            {/*        type="dark"*/}
                            {/*        onClick={handleGoogleSignIn}*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </div>
                        <div className="p-2 box text-center">
                            Don't have an account?{" "}
                            <Link to="/signup">Sign up</Link>
                        </div>
                    </div>
                </div>
                <MswFooter />
            </div>
        </>
    );
};

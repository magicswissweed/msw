import './MswForgotPassword.scss';
import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useUserAuth} from "../UserAuthContext";

export function MswForgotPassword() {
    const [email, setEmail] = useState("");
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    const {sendForgotPasswordEmail} = useUserAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        sendForgotPasswordEmail(email);
        setShowSuccessMsg(true);
    };

    return <>
        <div className="form">
            <div className="box-container">
                <div className="p-4 box">
                    <h2 className="mb-3">Reset Password</h2>

                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="Submit">
                                Reset Password
                            </Button>
                        </div>
                    </Form>

                    {showSuccessMsg &&
                        <p className="success-msg text-center">We sent you an email. Please check your inbox.</p>}

                    <div>
                        <p>Back to Login:</p>
                        {/* <MswLoginModal></MswLoginModal> // TODO: fix this*/}
                    </div>
                </div>
            </div>
        </div>
    </>;
}
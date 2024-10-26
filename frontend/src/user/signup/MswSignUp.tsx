import './MswSignUp.scss';
import React, {useRef, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useUserAuth} from "../UserAuthContext";
import {MswLogin} from "../login/MswLogin";
import Modal from "react-bootstrap/Modal";

const MswSignup = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    // @ts-ignore
    const {signUp} = useUserAuth();

    const [showSignupModal, setShowSignupModal] = useState(false);
    const handleShowSignupModal = () => setShowSignupModal(true);
    const handleCloseSignupModal = () => setShowSignupModal(false);

    const handleSignupAndCloseModal = (e: { preventDefault: () => void; }) => handleSubmit(e);

    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = async (e: { preventDefault: any; }) => {
        e.preventDefault()
        setError("");
        try {
            await signUp(email, password);
            handleCloseSignupModal();
        } catch (err: any) {
            if (err.message.includes('auth/email-already-in-use')) {
                setError('<p>This email is already registered. Please try to log in.</p>');
            } else if (err.message.includes('auth/weak-password')) {
                setError('Password should have at least 6 Characters.')
            } else {
                setError(err.message);
            }
        }
    };

    return (
        <>
            <button className="msw-button" onClick={handleShowSignupModal}>Sign up</button>
            <Modal show={showSignupModal} onHide={handleCloseSignupModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form">
                        {error && <p className="error-message" dangerouslySetInnerHTML={{__html: error}}></p>}

                        <Form ref={formRef} onSubmit={handleSignupAndCloseModal}>
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
                        </Form>
                    </div>
                    <div className="p-4 box mt-3 text-center">
                        Already have an account?
                        <MswLogin />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSignupModal}>
                        Cancel
                    </Button>
                    <Button variant="primary"
                            onClick={() => formRef.current && formRef.current.requestSubmit()}>
                        Sign up
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MswSignup;
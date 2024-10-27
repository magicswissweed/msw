import './MswLogin.scss';
import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {Alert, Button, Form} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {useUserAuth} from "../UserAuthContext";

interface MswLoginModalProps {
    isOpen: boolean,
    closeModal: () => void,
    openSignupModal: () => void
}

export const MswLoginModal = (props: MswLoginModalProps) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    // @ts-ignore
    const {logIn} = useUserAuth();

    const [showLoginModal, setShowLoginModal] = useState(props.isOpen);

    useEffect(() => {
        setShowLoginModal(props.isOpen);
    }, [props.isOpen]);

    const formRef = useRef<HTMLFormElement | null>(null);

    async function handleSubmit(e: { preventDefault: any; }) {
        e.preventDefault();
        setError("");
        try {
            await logIn(email, password);
            props.closeModal();
        } catch (err: any) {
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
    }

    function onOpenSignupModal() {
        props.closeModal();
        props.openSignupModal();
    }

    // const handleGoogleSignIn = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await googleSignIn();
    //         navigate("/spots");
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // };

    return (
        <>
            <Modal show={showLoginModal} onHide={props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form">
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form ref={formRef} onSubmit={handleSubmit}>
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

                            <Link className="forgot-password" to="/forgot-password">Forgot Password</Link>
                        </Form>
                        {/*<div className="google-button-container">*/}
                        {/*    <GoogleButton*/}
                        {/*        type="dark"*/}
                        {/*        onClick={handleGoogleSignIn}*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>
                    <div className="p-4 box mt-3 text-center">
                        Don't have an account?
                        <button className="msw-button" onClick={onOpenSignupModal}>Sign up</button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.closeModal}>
                        Cancel
                    </Button>
                    <Button variant="primary"
                            onClick={() => formRef.current && formRef.current.requestSubmit()}>
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
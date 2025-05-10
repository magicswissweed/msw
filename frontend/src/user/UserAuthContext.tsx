import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User,
} from "firebase/auth";
import {firebaseAuth} from '../firebase/FirebaseConfig';
import {UserApi} from '../gen/msw-api-ts';
import {authConfiguration} from '../api/config/AuthConfiguration';


// @ts-ignore
const userAuthContext: Context<any> = createContext();

export function useUserAuth() {
    return useContext(userAuthContext);
}

const userWasLoggedInCookieName = "msw-user-was-logged-in-cookie";
const userWasLoggedInCookieValue = "true";

// @ts-ignore
export function UserAuthContextProvider({children}) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const contextValue = useMemo(() => ({
        user, token, logIn, signUp, logOut, sendForgotPasswordEmail, googleSignIn
    }), [user, token]);

    useEffect(() => {
        const unsubscribe = firebaseAuth.onIdTokenChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setCookie(userWasLoggedInCookieName, userWasLoggedInCookieValue);
                const token = await currentUser.getIdToken(/* forceRefresh = */ false);
                setToken(token);
            } else {
                setToken(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <userAuthContext.Provider
            value={contextValue}
        >
            {children}
        </userAuthContext.Provider>
    );

    async function logIn(email: string, password: string) {
        return signInWithEmailAndPassword(firebaseAuth, email, password);
    }

    async function signUp(email: string, password: string): Promise<void> {
        let user = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        let token = await user.user.getIdToken(false);
        let config = await authConfiguration(token);
        await new UserApi(config).registerUser();
    }

    async function sendForgotPasswordEmail(email: string): Promise<void> {
        await sendPasswordResetEmail(firebaseAuth, email);
    }

    async function logOut() {
        await signOut(firebaseAuth);
        setCookie(userWasLoggedInCookieName, "");
        document.location.reload();
    }

    function googleSignIn() {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(firebaseAuth, googleAuthProvider);
    }
}

export function wasUserLoggedInBefore(): boolean {
    return getCookie(userWasLoggedInCookieName) == userWasLoggedInCookieValue;
}

function setCookie(cname: string, cvalue: string) {
    const d = new Date();
    d.setTime(d.getTime() + (356 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

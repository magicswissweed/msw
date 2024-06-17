import {createContext, useContext, useEffect, useState} from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {firebaseAuth} from '../firebase/FirebaseConfig';
import {Configuration, UserApi} from '../gen/msw-api-ts';
import {authConfiguration} from '../api/config/AuthConfiguration';


// @ts-ignore
const userAuthContext: Context<any> = createContext();

export function useUserAuth() {
  return useContext(userAuthContext);
}

// @ts-ignore
export function UserAuthContextProvider({children}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentuser) => {
      if (currentuser) {
        currentuser.getIdToken(false).then((token) => {
          setToken(token);
        })
      }
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{user, token, logIn, signUp, logOut, googleSignIn}}
    >
      {children}
    </userAuthContext.Provider>
  );

  function logIn(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  }

  function signUp(email: string, password: string, callback: () => void) {
    return createUserWithEmailAndPassword(firebaseAuth, email, password).then((user) => {
      user.user.getIdToken(false).then(token => {
        authConfiguration(token, (config: Configuration) => {
          new UserApi(config)
            .registerUser()
            .then(callback);
        });
      });
    });
  }

  function logOut() {
    return signOut(firebaseAuth).then(() => {
      document.location.reload();
    });
  }

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(firebaseAuth, googleAuthProvider);
  }
}
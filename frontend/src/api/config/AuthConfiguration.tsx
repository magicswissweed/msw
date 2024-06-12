import {Configuration} from '../../gen/msw-api-ts';
import {firebaseAuth} from '../../firebase/FirebaseConfig';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {
  clearAccessTokenInCookies, clearRefreshTokenInCookies,
  getAccessTokenFromCookies,
  setAccessTokenInCookies,
  setRefreshTokenInCookies,
} from './CookieAccessor';
export const ApiConfigurationInitialization = () => {

  firebaseAuth.onAuthStateChanged((user)=> {
    if (user) { // user is signed in
      setRefreshTokenInCookies(user.refreshToken)
      user.getIdToken(true).then(function (token) {
        setAccessTokenInCookies(token)
      })
    } else { // user is logged out
      clearRefreshTokenInCookies();
      clearAccessTokenInCookies();
    }
  });
  return <></>;
}

export function isUserLoggedIn() {
  return firebaseAuth.currentUser || getAccessTokenFromCookies();
}

export const authConfiguration = () => {
  const accessToken = getAccessTokenFromCookies();
  if(accessToken) {
    return new Configuration({
      baseOptions: {
        headers: { Authorization: 'Bearer ' + accessToken },
      }
    });
  } else {
    return new Configuration({});
  }
}

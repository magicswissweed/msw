import {Cookies} from 'react-cookie';

export function getAccessTokenFromCookies() {
  // TODO: check expiration and refresh token if necessary
  return new Cookies().get('access_token');
}

export function setAccessTokenInCookies(token: string) {
  setCookie('access_token', token);
}

export function clearAccessTokenInCookies() {
  setAccessTokenInCookies("");
}

export function getRefreshTokenFromCookies() {
  return new Cookies().get('refresh_token');
}

export function setRefreshTokenInCookies(token: string) {
  setCookie('refresh_token', token);
}

export function clearRefreshTokenInCookies() {
  setCookie('refresh_token');
}

function setCookie(name: string, value?: string | undefined) {
  const date = new Date();

  if (value) {
    // expire in 7 days
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
  } else {
    value = '';
    // expire in 1 ms
    date.setTime(date.getTime() + (1));
  }

  document.cookie = name+"="+value+"; expires="+date.toUTCString()+"; path=/";
}
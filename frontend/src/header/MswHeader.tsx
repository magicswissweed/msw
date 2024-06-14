import './MswHeader.scss'
import React, {Component, FormEvent} from 'react';
import {Link} from 'react-router-dom';
import {firebaseAuth} from '../firebase/FirebaseConfig';

export class MswHeader extends Component {
  render() {
    let loginOrLogout = <></>;
    if (firebaseAuth.currentUser) {
      loginOrLogout = <>
        <Link id="login-Button" className="logout" to="/" onClick={this.logout}>Logout</Link>
      </>
    } else {
      loginOrLogout = <>
        <Link id="login-Button" className="login" to="/login">Log in</Link>
        <Link id="login-Button" className="signup" to="/signup">Sign up</Link>
      </>
    }

    return <>
      <header className="App-header">
        <div className="loginOrLogoutContainer">
          {loginOrLogout}
        </div>
        <div className="title">
          <h1>MagicSwissWeed</h1>
          <p>Current surfing conditions in Switzerland</p>
        </div>
      </header>
    </>;
  }

  private logout(event: FormEvent<HTMLAnchorElement>) {
    event.preventDefault();
    firebaseAuth.signOut().then(() => window.location.reload());
  }
}
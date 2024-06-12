import './MswHeader.scss'
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebaseAuth} from '../firebase/FirebaseConfig';

export class MswHeader extends Component {
    render() {
        return <>
            <header className="App-header">
                <div className="title">
                    <h1>MagicSwissWeed</h1>
                    <p>Current surfing conditions in Switzerland</p>
                </div>
                <Link to='/login'>Login...</Link>
                <button onClick={this.logout}>Logout</button>
            </header>
        </>;
    }

    private logout(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        firebaseAuth.signOut().then(() => window.location.reload());
    }
}
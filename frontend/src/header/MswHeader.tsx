import './MswHeader.scss'
import {Component} from 'react';

export class MswHeader extends Component {
    render() {
        return <>
            <header className="App-header">
                <div className="title">
                    <h1>MagicSwissWeed</h1>
                    <p>Current surfing conditions in Switzerland</p>
                </div>
            </header>
        </>;
    }
}
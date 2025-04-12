import React, {Component} from 'react';
import './MswFooter.scss'

export class MswFooter extends Component {
    render() {
        return <>
            <footer>
                <div className="Footer">
                    <ul className='Footer_list'>
                        <li>Source:{" "}
                            <a href="https://www.hydrodaten.admin.ch">
                                BAFU
                            </a>
                        </li>
                        <li>Created by Nicola K&#252;ng and Aaron Studer</li>
                        <li>
                            <a href="mailto:magicswissweed@gmail.com?subject=Feedback">
                                Feedback
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </>;
    }
}

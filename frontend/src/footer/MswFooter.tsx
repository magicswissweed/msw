import React, {Component} from 'react';
import './MswFooter.scss'

export class MswFooter extends Component {
    render() {
        return <>
            <footer>
                <div className="Footer">
                    <div className="Footer_item">
                        Source:{" "}
                        <a href="https://www.hydrodaten.admin.ch">
                            BAFU
                        </a>
                    </div>
                    <div className="Footer_item">
                        © 2024 Academic Surf Club Switzerland
                    </div>
                    <div className="Footer_item">
                        <a href="https://github.com/nkueng/MagicSwissWeed/issues">
                            Feedback
                        </a>
                    </div>
                </div>
            </footer>
        </>;
    }
}
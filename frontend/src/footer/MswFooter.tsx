import React, {Component} from 'react';

export class MswFooter extends Component {
    render() {
        return <>
            <footer>
                <div className="Footer">
                    <div className="Footer_item">
                        Source:{" "}
                        <a className="Link" href="https://www.hydrodaten.admin.ch">
                            BAFU
                        </a>
                    </div>
                    <div className="Footer_item wide">
                        © 2023 Academic Surf Club Switzerland
                    </div>
                    <div className="Footer_item">
                        <a
                            className="Link"
                            href="https://github.com/nkueng/MagicSwissWeed/issues"
                        >
                            Feedback
                        </a>
                    </div>
                </div>
            </footer>
        </>;
    }
}
import "./MswOverviewPage.scss";
import React, {Component} from "react";
import {MswHeader} from '../header/MswHeader';
import {MswFooter} from '../footer/MswFooter';

export class MswOverviewPage extends Component {

  render() {
    return (
        <div className="App">
          <MswHeader/>
          // TODO: add content
          <MswFooter/>
        </div>
    );
  }
}

import "./MswOverviewPage.scss";
import React, {Component} from "react";
import {MswHeader} from '../header/MswHeader';
import {MswFooter} from '../footer/MswFooter';
import {SpotList} from './spotlist/SpotList'

export class MswOverviewPage extends Component {

  render() {
    let riverSurfLocations: Array<Number> = [2018, 2243];
    let bungeeSurfLocations: Array<Number> = [2135, 2152];

    // TODO: replace locations with something useful
    return <>
      <div className="App">
        <MswHeader/>
        <div className="surfspots">
          <div className="riversurf">
            <SpotList title="Riversurf" locations={riverSurfLocations}/>
          </div>
          <div className="bungeesurf">
            <SpotList title="Bungeesurf" locations={bungeeSurfLocations}/>
          </div>
        </div>
        <MswFooter/>
      </div>
    </>;
  }
}

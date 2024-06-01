import "./MswOverviewPage.scss";
import React, {Component} from "react";
import {MswHeader} from '../header/MswHeader';
import {MswFooter} from '../footer/MswFooter';
import {SpotList} from './spotlist/SpotList'
import {ApiSpotInformationList, SpotsApi} from '../gen/msw-api-ts';
import {MswLoader} from '../loader/MswLoader';

interface MswOverviewPageState {
  data: ApiSpotInformationList | null
}

export class MswOverviewPage extends Component<any, any> {
  state: MswOverviewPageState = {
    data: null,
  };

  componentDidMount() {
    // TODO: toggle includeAll
    new SpotsApi().getSpots({includeAll: false}).subscribe((res) => {
      if(res && res.riverSurfSpots && res.bungeeSurfSpots) {
        this.setState({data: res});
      }
    });
  }

  render() {
    const state: MswOverviewPageState = this.state;

    return <>
      <div className="App">
        <MswHeader/>
        {state.data ? this.getContent(state.data) : <MswLoader />}
        <MswFooter/>
      </div>
    </>;
  }

  private getContent(data: ApiSpotInformationList) {
    return <>
      <div className="surfspots">
        <div className="riversurf">
          <SpotList title="Riversurf" locations={data.riverSurfSpots!}/>
        </div>
        <div className="bungeesurf">
          <SpotList title="Bungeesurf" locations={data.bungeeSurfSpots!}/>
        </div>
      </div>
    </>;
  }
}

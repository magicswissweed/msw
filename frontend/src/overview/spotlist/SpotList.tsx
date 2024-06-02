import './SpotList.scss';
import React, {Component} from 'react';
import arrow_down from "../../assets/arrow_down.png";
import {Spot} from './spot/Spot';
import {ApiSpotInformation} from '../../gen/msw-api-ts';

interface SpotListProps {
  title: string,
  locations: any
}

export class SpotList extends Component<SpotListProps> {
  private readonly title: string;
  private readonly locations: Array<ApiSpotInformation> = new Array<ApiSpotInformation>();

  constructor(props: SpotListProps) {
    super(props);
    this.title = props.title;
    this.locations = props.locations;
  }
  render() {
    let tableHeader = <div className="tableHeaderContainer hiddenOnMobile">
      <div className="tableHeader hiddenOnMobile">
        <div className="tableHeaderCol">Name</div>
        <div className="tableHeaderCol">Flow/Temp</div>
        <div className="tableHeaderCol doubleCol">Forecast</div>
      </div>
      {/* only to have the same columns as in the spots */}
      {SpotList.getCollapsibleIcon(true)}
    </div>;

    this.locations.forEach((location) => console.log(location));

    return <>
      <div className="spotsContainer">
        <h2>{this.title}</h2>
        {tableHeader}
        <div>
          {this.locations.map((location) => (<Spot location={location} />))}
        </div>
      </div>
    </>;
  }

  public static getCollapsibleIcon(isHidden: Boolean) {
    let className = "collapsibleIcon hiddenOnMobile";
    if(isHidden) {
      className += " hide";
    }
    return <>
      <span className={className}>
        <img alt="extend forecast" src={arrow_down} />
      </span>
    </>;
  }
}
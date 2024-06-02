import './Spot.scss'
import React, {Component} from 'react';
import {ApiSpotInformation} from '../../../gen/msw-api-ts';
import {SpotList} from '../SpotList';
import {MswMeasurement} from './measurement/MswMeasurement';
import {MswMiniForecast} from './miniForecast/MswMiniForecast';
import {MswForecastGraph} from './forecast/MswForecastGraph';

interface SpotProps {
  location: ApiSpotInformation
}

export class Spot extends Component<SpotProps> {

  private readonly location: ApiSpotInformation;

  constructor(props: SpotProps) {
    super(props);
    this.location = props.location;
  }

  render() {
    return <>
      <details key={this.props.location.name} className="spot">
        <summary className="spotname">
          {this.getSpotSummaryContent(this.props.location)}
        </summary>
        {this.getCollapsibleContent(this.props.location)}
      </details>
    </>;
  }

  private getSpotSummaryContent(location: ApiSpotInformation) {
    let link = "https://www.hydrodaten.admin.ch/de/seen-und-fluesse/stationen-und-daten/" + location.stationId;

    return <>
      <div className="spotContainer">
        <a href={link} target="_blank" rel="noreferrer">
          {location.name}
        </a>
        <MswMeasurement location={location}/>
        <MswMiniForecast location={location}/>
      </div>
      {SpotList.getCollapsibleIcon(!location.forecast)}
    </>
  }

  private getCollapsibleContent(location: ApiSpotInformation) {
    return <>
      <div className="collapsibleContent hiddenOnMobile">
        <h2>Forecast</h2>
        {/* TODO: looks buggy that I have to add isMobile here */}
        <MswForecastGraph location={location} isMini={false} isMobile={false} />
      </div>
    </>;
  }
}
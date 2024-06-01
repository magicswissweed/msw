import './Spot.scss'
import React, {Component} from 'react';
import {ApiSpotInformation} from '../../../gen/msw-api-ts';
import {SpotList} from '../SpotList';
import {MswMeasurement} from './measurement/MswMeasurement';

interface SpotProps {
  location: ApiSpotInformation
}

export class Spot extends Component<{ location: ApiSpotInformation }> {

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
        {/*TODO forecast*/}
        <MswMeasurement location={location}/>
        {/*{forecast}*/}
      </div>
      {SpotList.getCollapsibleIcon(!location.forecast)}
    </>
  }

  private getCollapsibleContent(location: ApiSpotInformation) {
    return <>
      <div className="collapsibleContent hiddenOnMobile">
        <h2>Forecast</h2>
        TODO: Big Forecast
        {/*<MswForecastGraph location={location} forecastData={forecastData} flowAndTempData={flowAndTempData} />*/}
      </div>
    </>;
  }
}
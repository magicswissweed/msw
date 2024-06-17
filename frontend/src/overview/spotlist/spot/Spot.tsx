import './Spot.scss'
import React, {Component} from 'react';
import {ApiSpotInformation} from '../../../gen/msw-api-ts';
import {MswMeasurement} from './measurement/MswMeasurement';
import {MswMiniGraph} from './miniForecast/MswMiniGraph';
import {MswForecastGraph} from './forecast/MswForecastGraph';
import arrow_down from '../../../assets/arrow_down.png';
import lock from '../../../assets/lock.svg';
import {MswLastMeasurementsGraph} from './historical/MswLastMeasurementsGraph';

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
        <MswMiniGraph location={location}/>
      </div>
      <div className="right-side-icons-container">
        <div className="is-private-icon">
          <img className={location.isPublic ? "public" : ""}
               alt="This is a private spot. Only you can see it."
               title="This is a private spot. Only you can see it."
               src={lock}/>
        </div>
        {Spot.getCollapsibleIcon(false)}
      </div>
    </>
  }

  private getCollapsibleContent(location: ApiSpotInformation) {
    let forecastContent = <>
      <h2>Forecast</h2>
      <MswForecastGraph location={location} isMini={false}/>
    </>;

    let lastMeasurementsContent = <>
      <h2>Forecast</h2>
      <MswLastMeasurementsGraph location={location} isMini={false}/>
    </>;

    return <>
      <div className="collapsibleContent hiddenOnMobile">
        {location.forecast ? forecastContent : lastMeasurementsContent}
      </div>
    </>;
  }

  public static getCollapsibleIcon(isHidden: Boolean) {
    let className = "collapsibleIcon hiddenOnMobile";
    if (isHidden) {
      className += " hide";
    }
    return <>
      <span className={className}>
        <img alt="extend forecast" src={arrow_down}/>
      </span>
    </>;
  }
}
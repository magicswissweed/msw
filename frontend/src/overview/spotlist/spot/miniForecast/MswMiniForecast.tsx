import './MswMiniForecast.scss'
import React, {Component} from 'react';
import {ApiSpotInformation} from '../../../../gen/msw-api-ts';
import {MswForecastGraph} from '../forecast/MswForecastGraph';

interface MswMiniForecastProps {
  location: ApiSpotInformation
}

export class MswMiniForecast extends Component<MswMiniForecastProps> {
  private readonly location: ApiSpotInformation;

  constructor(props: MswMiniForecastProps) {
    super(props);
    this.location = props.location;
  }

  render() {
    // return 2 forecasts switchable by screen size (hacky because recharts is not really responsive)
    return <>
      {this.getForecast(true)}
      {this.getForecast(false)}
    </>;
  }

  private getForecast(isMobile: boolean) {
    let content;
    if(this.location.forecast) {
      content = <MswForecastGraph location={this.location}
                                  isMini={true}
                                  isMobile={isMobile}/>;
    } else {
      content = <>
        <p>TODO: add Visualization if there is no forecast</p>
        </>;
    }

    let className = "forecastContainer";
    if(isMobile) {
      className += " hiddenOnDesktop";
    } else {
      className += " hiddenOnMobile";
    }
    return <>
      <div className={className}>
        <div className="miniGraph">
          {content}
        </div>
      </div>
    </>;
  }
}

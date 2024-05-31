import "./MswOverviewPage.scss";
import React, {Component} from "react";
import {MswHeader} from '../header/MswHeader';
import {MswFooter} from '../footer/MswFooter';
import {CurrentSampleApi, ForecastApi} from '../gen/msw-api-ts';

export class MswOverviewPage extends Component {

  render() {
      return (
        <div className="App">
          <MswHeader/>
            <button onClick={this.getCurrentSample}>Get Current Sample</button>
            <button onClick={this.getForecast}>Get Forecast</button>
          <MswFooter/>
        </div>
    );
  }
  private getCurrentSample() {
    new CurrentSampleApi().getCurrentSample({"stationId": 2018}).subscribe(response => {
      console.log("flow: " + response.flow)
      console.log("temp: " + response.temperature)
    })
  }

  private getForecast () {
    new ForecastApi().getForecast({"stationId": 2018}).subscribe((response => {
        console.log(response.timestamp);
    }));
  };
}

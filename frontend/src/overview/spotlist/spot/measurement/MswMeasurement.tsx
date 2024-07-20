import './MswMeasurement.scss'
import {Component} from 'react';
import {ApiSample, ApiSpotInformation} from '../../../../gen/msw-api-ts';

interface MeasurementsProps {
    location: ApiSpotInformation
}

export class MswMeasurement extends Component<MeasurementsProps> {

    private readonly location: ApiSpotInformation;

    constructor(props: MeasurementsProps) {
        super(props);
        this.location = props.location;
    }

    render() {
      let temperature = this.location.currentSample!.temperature;
        return <>
            <div className="measurements">
                {/* <div className="measurement_row timestamp">
                    {this.convertTimeStampToDisplayableString(this.location.currentSample!.timestamp!)}
                </div> */}

                <div className="measurement_row meas flow">
                    {this.getFlow()}
                </div>

                {temperature &&
                    <div className="measurement_row meas temp">
                        <div className={this.convertTemperatureToColor(temperature)}>{Math.round(temperature)}</div>
                        <div className="unit">°C</div>
                    </div>
                }

            </div>
        </>;
    }

    private getFlow() {
      let flow = this.location.currentSample!.flow;
      let min_flow = this.location.minFlow;
      let max_flow = this.location.maxFlow;
      
        return <>
            <div className={this.convertFlowToColor(flow!, min_flow!, max_flow!)}>{flow}</div>
            <div className="unit">
                m<sup>3</sup>/s
            </div>

            {/* Not yet possible, because we don't get the minFlowForDanger from the backend atm */}
            {/*{this.location.currentSample.flow > this.location.minFlowForDanger && (*/}
            {/*  <div*/}
            {/*    className="danger"*/}
            {/*    title="Moderate flood danger, be careful!"*/}
            {/*  >*/}
            {/*    &ensp; ⚠️*/}
            {/*  </div>*/}
            {/*)}*/}
        </>;
    }

    private convertTimeStampToDisplayableString(timestampString: string) {
        let date = new Date(timestampString);
        return date.getHours() + ":" + ((date.getMinutes() == 0) ? "00" : date.getMinutes());
    }

    // convert flow value to color
    private convertFlowToColor(_flow: number, _min_flow: number, _max_flow: number) {
      if (_flow >= _min_flow && _flow <= _max_flow) {
        return "flow_good";
      } else {
        return "flow_bad";
      }
    }

    // convert temperature value to color
    private convertTemperatureToColor(_temp: number) {
      if (_temp < 8) {
        return "temp_0";
      }
      if (_temp < 13) {
        return "temp_1";
      }
      if (_temp < 18) {
        return "temp_2";
      }
      if (_temp < 23) {
        return "temp_3";
      }
      return "temp_4";
    }
}

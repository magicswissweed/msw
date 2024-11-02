import './MswMeasurement.scss'
import {Component} from 'react';
import {ApiSpotInformation} from '../../../../gen/msw-api-ts';

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
        return <>
            <div className="measurements"
                 title={'Measured at: ' + this.convertTimeStampToDisplayableString(this.location.currentSample!.timestamp!)}
                 tabIndex={0}>
                <div className="measurement_row meas flow">
                    {this.getFlow()}
                </div>

                {this.location.currentSample!.temperature &&
                    <div className="measurement_row meas temp">
                      {this.getTemp()}
                    </div>
                }
            </div>
        </>;
    }

    private getFlow() {
        let flow: number = this.location.currentSample!.flow;
        return <>
            <div className={this.getFlowColor(flow)}>{flow}</div>
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

    private getFlowColor(_flow: number) {

        if (_flow < this.location.minFlow) {
          return "flow_bad";
        }

        if (_flow < this.location.maxFlow) {
          return "flow_good";
        }

        return "flow_bad";
    }

    private getTemp() {
        let temp: number = this.location.currentSample!.temperature ?? 0;
        return <>
              <div className={this.getTempColor(temp)}>{temp}</div>
              <div className="unit">°C</div>
        </>;
      }

    private getTempColor(_temp: number) {
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

    private convertTimeStampToDisplayableString(timestampString: string) {
        let date = new Date(timestampString);
        return date.getHours() + ":" + ((date.getMinutes() == 0) ? "00" : date.getMinutes());
    }
}

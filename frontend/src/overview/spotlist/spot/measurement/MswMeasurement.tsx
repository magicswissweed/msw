import './MswMeasurement.scss'
import {Component} from 'react';
import {ApiSpotInformation} from '../../../../gen/msw-api-ts';

interface MeasurementsProps {
  location: ApiSpotInformation
}

export class MswMeasurement extends Component<{ location: ApiSpotInformation }> {

  private readonly location: ApiSpotInformation;

  constructor(props: MeasurementsProps) {
    super(props);
    this.location = props.location;
  }

  render() {
    return <>
      <div className="measurements">
        <div className="measurement_row timestamp">
          {this.convertTimeStampToDisplayableString(this.location.currentSample!.timestamp!)}
        </div>

        <div className="measurement_row meas flow">
          {this.getFlow()}
        </div>

        <div className={"measurement_row meas temp"}>
          <div>{this.location.currentSample!.temperature}</div>
          <div className="unit">°C</div>
        </div>
      </div>
    </>;
  }

  private getFlow() {
    return <>
      <div>{this.location.currentSample!.flow}</div>
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
    return date.getHours() + ":" + date.getMinutes();
  }
}

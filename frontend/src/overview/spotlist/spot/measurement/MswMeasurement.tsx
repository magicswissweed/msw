import './MswMeasurement.scss'
import {Component} from 'react';
import {ApiSpotInformation} from '../../../../gen/msw-api-ts';
import {FlowColorEnum, locationsService} from "../../../../service/LocationsService";

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
        let flowColorEnum = locationsService.getFlowColorEnum(this.location, _flow);
        switch (flowColorEnum) {
            case FlowColorEnum.GREEN:
                return "flow_good";
            case FlowColorEnum.ORANGE:
                return "flow_could_become_good";
            case FlowColorEnum.RED:
                return "flow_bad";
        }
    }


    private getTemp() {
        let temp: number = this.location.currentSample!.temperature ?? 0;
        return <>
            <div>{temp}</div>
            <div className="unit">°C</div>
        </>;
    }

    private convertTimeStampToDisplayableString(timestampString: string) {
        let date = new Date(timestampString);
        return date.getHours() + ":" + ((date.getMinutes() === 0) ? "00" : date.getMinutes());
    }
}

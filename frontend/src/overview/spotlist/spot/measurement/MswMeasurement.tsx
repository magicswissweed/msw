import './MswMeasurement.scss'
import {Component} from 'react';
import {FlowColorEnum, getFlowColorEnum} from "../../../../service/SpotsHelper";
import {SpotModel} from "../../../../model/SpotModel";

interface MeasurementsProps {
    spot: SpotModel
}

export class MswMeasurement extends Component<MeasurementsProps> {

    private readonly spot: SpotModel;

    constructor(props: MeasurementsProps) {
        super(props);
        this.spot = props.spot;
    }

    render() {
        return <>
            <div className="measurements"
                 title={'Measured at: ' + this.convertTimeStampToDisplayableString(this.spot.currentSample!.timestamp!)}
                 tabIndex={0}>
                <div className="measurement_row meas flow">
                    {this.getFlow()}
                </div>

                <div className="measurement_row meas temp">
                    {this.getTemp()}
                </div>
            </div>
        </>;
    }

    private getFlow() {
        let flow: number = this.spot.currentSample!.flow;
        return <>
            <div className={this.getFlowColor(flow)}>{flow}</div>
            <div className="unit">
                m<sup>3</sup>/s
            </div>

            {/* Not yet possible, because we don't get the minFlowForDanger from the backend atm */}
            {/*{this.spot.currentSample.flow > this.spot.minFlowForDanger && (*/}
            {/*  <div*/}
            {/*    className="danger"*/}
            {/*    title="Moderate flood danger, be careful!"*/}
            {/*  >*/}
            {/*    &ensp; ⚠️*/}
            {/*  </div>*/}
            {/*)}*/}
        </>;
    }

    private getFlowColor(flow: number) {
        let flowColorEnum = getFlowColorEnum(this.spot, flow);
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
        if (!this.spot.currentSample!.temperature) {
            return <>
                <div style={{ visibility: 'hidden' }}>15.5</div>
                <div className="unit" style={{ visibility: 'hidden' }}>°C</div>
            </>;
        }
        
        let temp: number = this.spot.currentSample!.temperature;
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

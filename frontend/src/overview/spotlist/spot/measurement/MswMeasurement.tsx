import './MswMeasurement.scss'
import {Component} from 'react';
import {ApiForecast, ApiLineEntry, ApiSpotInformation} from '../../../../gen/msw-api-ts';

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
            <div className={this.getFlowColor(flow, this.location.forecast)}>{flow}</div>
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

    private getFlowColor(_flow: number, forecast: ApiForecast) {
        if (this.isInSurfableRange(_flow)) {
            return "flow_good"
        }

        if (this.forecastShowsTendencyToBecomeGood(_flow, forecast)) {
            return "flow_could_become_good";
        }

        return "flow_bad";
    }

    private isInSurfableRange(_flow: number) {
        return _flow > this.location.minFlow && _flow < this.location.maxFlow;
    }

    private forecastShowsTendencyToBecomeGood(flow: number, forecast: ApiForecast) {
        function getMinFlowInLine(min: Array<ApiLineEntry>) {
            return Math.min(...min.map(entry => entry.flow));
        }

        function getMaxFlowInLine(max: Array<ApiLineEntry>) {
            return Math.max(...max.map(entry => entry.flow));
        }

        let minFlowInForecast = getMinFlowInLine(forecast.min);
        let maxFlowInForecast = getMaxFlowInLine(forecast.max);
        return this.isInSurfableRange(minFlowInForecast) ||
            this.isInSurfableRange(maxFlowInForecast) ||
            (flow < this.location.minFlow && maxFlowInForecast > this.location.minFlow) ||
            (flow > this.location.maxFlow && minFlowInForecast < this.location.maxFlow)
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

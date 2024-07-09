import './MswMiniForecast.scss'
import React, {Component} from 'react';
import {ApiSpotInformation} from '../../../../gen/msw-api-ts';
import {MswForecastGraph} from '../forecast/MswForecastGraph';
import {MswLastMeasurementsGraph} from '../historical/MswLastMeasurementsGraph';

interface MswMiniForecastProps {
    location: ApiSpotInformation
}

export class MswMiniGraph extends Component<MswMiniForecastProps> {
    private readonly location: ApiSpotInformation;

    constructor(props: MswMiniForecastProps) {
        super(props);
        this.location = props.location;
    }

    render() {
        let content;
        if (this.location.forecast) {
            content = <MswForecastGraph location={this.location} isMini={true}/>;
        } else {
            content = <MswLastMeasurementsGraph location={this.location} isMini={true}/>
        }

        let className = "forecastContainer";
        return <>
            <div className={className}>
                <div className="miniGraph">
                    {content}
                </div>
            </div>
        </>;
    }
}

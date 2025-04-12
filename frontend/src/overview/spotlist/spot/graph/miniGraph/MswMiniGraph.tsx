import './MswMiniGraph.scss'
import React from 'react';
import {ApiSpotInformation} from '../../../../../gen/msw-api-ts';
import {MswForecastGraph} from '../forecast/MswForecastGraph';
import {MswLastMeasurementsGraph} from '../historical/MswLastMeasurementsGraph';
import {GraphTypeEnum} from "../../../../MswOverviewPage";
import {MswHistoricalYearsGraph} from "../historical/MswHistoricalYearsGraph";

interface MswMiniForecastProps {
    location: ApiSpotInformation,
    showGraphOfType: GraphTypeEnum
}

export const MswMiniGraph = (props: MswMiniForecastProps) => {

    let content;
    if (props.showGraphOfType === GraphTypeEnum.Forecast) {
        if (props.location.forecast) {
            content = <MswForecastGraph location={props.location} aspectRatio={3}/>;
        } else {
            content = <MswLastMeasurementsGraph location={props.location} aspectRatio={3}/>
        }
    } else {
        content = <MswHistoricalYearsGraph location={props.location} aspectRatio={3}/>
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

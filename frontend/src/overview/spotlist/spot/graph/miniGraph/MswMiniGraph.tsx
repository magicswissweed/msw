import './MswMiniGraph.scss'
import React from 'react';
import {MswForecastGraph} from '../forecast/MswForecastGraph';
import {MswLastMeasurementsGraph} from '../historical/MswLastMeasurementsGraph';
import {GraphTypeEnum} from "../../../../MswOverviewPage";
import {MswHistoricalYearsGraph} from "../historical/MswHistoricalYearsGraph";
import {SpotModel} from "../../../../../model/SpotModel";

interface MswMiniForecastProps {
    spot: SpotModel,
    showGraphOfType: GraphTypeEnum
}

export const MswMiniGraph = (props: MswMiniForecastProps) => {

    let content;
    if (props.showGraphOfType === GraphTypeEnum.Forecast) {
        if (props.spot.forecastLoaded) {
            if (props.spot.forecast) {
                content = <MswForecastGraph spot={props.spot} aspectRatio={3}/>;
            } else {
                content = <MswLastMeasurementsGraph spot={props.spot} aspectRatio={3}/>
            }
        } else {
            content = <p>Loading...</p> // TODO: use loader
        }
    } else {
        content = <MswHistoricalYearsGraph spot={props.spot} aspectRatio={3}/>
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

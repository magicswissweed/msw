import './MswMiniGraph.scss'
import React from 'react';
import {MswForecastGraph} from '../forecast/MswForecastGraph';
import {MswLastMeasurementsGraph} from '../historical/MswLastMeasurementsGraph';
import {GraphTypeEnum} from "../../../../MswOverviewPage";
import {MswHistoricalYearsGraph} from "../historical/MswHistoricalYearsGraph";
import {SpotModel} from "../../../../../model/SpotModel";
import {MswLoader} from "../../../../../loader/MswLoader";

interface MswMiniForecastProps {
    spot: SpotModel,
    showGraphOfType: GraphTypeEnum,
    aspectRatioMini?: number
}

export const MswMiniGraph = ({
    spot,
    showGraphOfType,
    aspectRatioMini = 3
}: MswMiniForecastProps) => {

    let content;
    if (showGraphOfType === GraphTypeEnum.Forecast) {
        if (spot.forecastLoaded) {
            if (spot.forecast) {
                content = <MswForecastGraph spot={spot} isMini={true} aspectRatio={aspectRatioMini}/>;
            } else {
                content = <MswLastMeasurementsGraph spot={spot} isMini={true} aspectRatio={aspectRatioMini}/>
            }
        } else {
            content = <MswLoader/>
        }
    } else {
        content = <MswHistoricalYearsGraph spot={spot} isMini={true} aspectRatio={aspectRatioMini}/>
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

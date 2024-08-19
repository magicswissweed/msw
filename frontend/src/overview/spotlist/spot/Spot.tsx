import './Spot.scss'
import React from 'react';
import {ApiSpotInformation, SpotsApi} from '../../../gen/msw-api-ts';
import {MswMeasurement} from './measurement/MswMeasurement';
import {MswMiniGraph} from './miniForecast/MswMiniGraph';
import {MswForecastGraph} from './forecast/MswForecastGraph';
import arrow_down from '../../../assets/arrow_down.png';
import lock from '../../../assets/lock.svg';
import delete_icon from '../../../assets/delete_icon.svg';
import group from '../../../assets/group.svg';
import {MswLastMeasurementsGraph} from './historical/MswLastMeasurementsGraph';
import {authConfiguration} from '../../../api/config/AuthConfiguration';
import {useUserAuth} from '../../../user/UserAuthContext';

interface SpotProps {
    location: ApiSpotInformation,
    dragHandleProps: any
}

export const Spot = (props: SpotProps) => {

    // @ts-ignore
    const {token, user} = useUserAuth();

    return <>
        <details key={props.location.name} className="spot">
            <summary className="spotname">
                {getSpotSummaryContent(props.location)}
            </summary>
            {getCollapsibleContent(props.location)}
        </details>
    </>;

    function getSpotSummaryContent(location: ApiSpotInformation) {
        let link = "https://www.hydrodaten.admin.ch/de/seen-und-fluesse/stationen-und-daten/" + location.stationId;

        return <>
            <div className='icons-container'>
                <div className={'icon drag-drop-icon'} {...props.dragHandleProps}>
                    ☰
                </div>
            </div>
            <div className="spotContainer">
                <a href={link} target="_blank" rel="noreferrer">
                    {location.name}
                </a>
                <MswMeasurement location={location}/>
                <MswMiniGraph location={location}/>
            </div>
            <div className="icons-container">
                <div className="icon">
                    {location.isPublic ?
                        <img className={"public"}
                             alt="This is a public spot. Everyone can see it."
                             title="This is a public spot. Everyone can see it."
                             src={group}/> :
                        <img alt="This is a private spot. Only you can see it."
                             title="This is a private spot. Only you can see it."
                             src={lock}/>
                    }

                </div>
                {user &&
                    <div className="icon" onClick={() => onDeleteSpot(location)}>
                        <img alt="Delete this spot from your dashboard." src={delete_icon}/>
                    </div>
                }
                <div className="collapsible-icon icon">
                    <img alt="extend forecast" src={arrow_down}/>
                </div>
            </div>
        </>
    }

    function getCollapsibleContent(location: ApiSpotInformation) {
        let forecastContent = <>
            <h2>Forecast</h2>
            <MswForecastGraph location={location} isMini={false}/>
        </>;

        let lastMeasurementsContent = <>
            <h2>Forecast</h2>
            <MswLastMeasurementsGraph location={location} isMini={false}/>
        </>;

        return <>
            <div className="collapsibleContent">
                {location.forecast ? forecastContent : lastMeasurementsContent}
            </div>
        </>;
    }

    async function onDeleteSpot(location: ApiSpotInformation) {
        let config = await authConfiguration(token);
        await new SpotsApi(config).deletePrivateSpot(location.id!)
        document.location.reload();
    }
}
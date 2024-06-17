import './Spot.scss'
import React from 'react';
import {ApiSpotInformation, Configuration, SpotsApi} from '../../../gen/msw-api-ts';
import {MswMeasurement} from './measurement/MswMeasurement';
import {MswMiniGraph} from './miniForecast/MswMiniGraph';
import {MswForecastGraph} from './forecast/MswForecastGraph';
import arrow_down from '../../../assets/arrow_down.png';
import lock from '../../../assets/lock.svg';
import {MswLastMeasurementsGraph} from './historical/MswLastMeasurementsGraph';
import {authConfiguration} from '../../../api/config/AuthConfiguration';
import {useUserAuth} from '../../../user/UserAuthContext';

interface SpotProps {
  location: ApiSpotInformation
}

export const Spot = (props: SpotProps) => {

  // @ts-ignore
  const {token} = useUserAuth();

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
      <div className="spotContainer">
        <a href={link} target="_blank" rel="noreferrer">
          {location.name}
        </a>
        <MswMeasurement location={location}/>
        <MswMiniGraph location={location}/>
      </div>
      <div className="right-side-icons-container">
        <div className="is-private-icon">
          <img className={location.isPublic ? "public" : ""}
               alt="This is a private spot. Only you can see it."
               title="This is a private spot. Only you can see it."
               src={lock}/>
        </div>
        {getCollapsibleIcon(false)}
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

    const privateSpotInteractions = <>
      <button className="msw-button delete-spot-btn" onClick={() => onDeleteSpot(location)}>Delete Spot</button>
    </>;
    return <>
      <div className="collapsibleContent hiddenOnMobile">
        {location.forecast ? forecastContent : lastMeasurementsContent}
      </div>
      {!location.isPublic && privateSpotInteractions}
    </>;
  }

  function onDeleteSpot(location: ApiSpotInformation) {
    authConfiguration(token, (config: Configuration) => {
      new SpotsApi(config).deletePrivateSpot(location.id!).then(() => document.location.reload());
    });
  }
}

export function getCollapsibleIcon(isHidden: Boolean) {
  let className = "collapsibleIcon hiddenOnMobile";
  if (isHidden) {
    className += " hide";
  }
  return <>
      <span className={className}>
        <img alt="extend forecast" src={arrow_down}/>
      </span>
  </>;
}
import './SpotList.scss';
import React from 'react';
import {Spot} from './spot/Spot';
import {ApiSpotInformation} from '../../gen/msw-api-ts';

interface SpotListProps {
  title: string,
  locations: Array<ApiSpotInformation>
}

export const SpotList = (props: SpotListProps) => {
  let tableHeader = <div className="tableHeaderContainer hiddenOnMobile">
    <div className="tableHeader hiddenOnMobile">
      <div className="tableHeaderCol">Name</div>
      <div className="tableHeaderCol">Flow/Temp</div>
      <div className="tableHeaderCol doubleCol">Forecast</div>
    </div>
    {/* only to have the same columns as in the spots */}
    {Spot.getCollapsibleIcon(true)}
  </div>;

  return <>
    <div className="spotsContainer">
      <h2>{props.title}</h2>
      {tableHeader}
      <div>
        {props.locations.map((location) => (<Spot location={location}/>))}
      </div>
    </div>
  </>;
}
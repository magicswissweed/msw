import './SpotList.scss';
import React, {useEffect, useState} from 'react';
import {ApiSpotInformation, Configuration, SpotsApi} from '../../gen/msw-api-ts';
import {getCollapsibleIcon, Spot} from './spot/Spot';
import {authConfiguration} from '../../api/config/AuthConfiguration';
import {useUserAuth} from '../../user/UserAuthContext';

interface SpotListProps {
    title: string,
    locations: Array<ApiSpotInformation>
}

export const SpotList = (props: SpotListProps) => {
    const [locations, setLocations] = useState<Array<ApiSpotInformation>>(props.locations);
    const [draggingItem, setDraggingItem] = useState<ApiSpotInformation | null>(null);

    // @ts-ignore
    const {token} = useUserAuth();

    useEffect(() => {
        setLocations(props.locations);
    }, [props.locations]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ApiSpotInformation) => {
        setDraggingItem(item);
        e.dataTransfer.setData('text/plain', '');
    };

    const handleDragEnd = () => {
        setDraggingItem(null);
    };

    const handleDragOver = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetItem: any) => {
        if (!draggingItem) return;

        const tempLocations = locations;

        const currentIndex = tempLocations.indexOf(draggingItem);
        const targetIndex = tempLocations.indexOf(targetItem);

        if (currentIndex !== -1 && targetIndex !== -1) {
            tempLocations.splice(currentIndex, 1);
            tempLocations.splice(targetIndex, 0, draggingItem);
            authConfiguration(token, (config: Configuration) => {
                new SpotsApi(config).orderSpots(
                    locations
                        .filter(loc => loc.id)
                        .map(loc => loc.id!));
            });
            setLocations(tempLocations);
        }
    };

    let tableHeader = <div className="tableHeaderContainer hiddenOnMobile">
        <div className="tableHeader hiddenOnMobile">
            <div className="tableHeaderCol">Name</div>
            <div className="tableHeaderCol">Flow/Temp</div>
            <div className="tableHeaderCol doubleCol">Forecast</div>
        </div>
        {/* only to have the same columns as in the spots */}
        {getCollapsibleIcon(true)}
    </div>;

    return <>
        <div className="spotsContainer">
            <h2>{props.title}</h2>
            {tableHeader}
            <div className="sortable-list">
                {locations.map((location: ApiSpotInformation) => (
                    <div
                        className=
                            {`item ${location === draggingItem ?
                                'dragging' : ''
                            }`}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, location)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, location)}
                    >
                        <Spot location={location}/>
                    </div>
                ))}
            </div>
        </div>
    </>;
}
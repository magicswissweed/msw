import "./MswOverviewPage.scss";
import React, {useEffect, useState} from "react";
import {MswHeader} from '../header/MswHeader';
import {MswFooter} from '../footer/MswFooter';
import {SpotList} from './spotlist/SpotList'
import {ApiSpotInformation} from '../gen/msw-api-ts';
import {MswLoader} from '../loader/MswLoader';
import {useUserAuth, wasUserLoggedInBefore} from '../user/UserAuthContext';
import {locationsService} from "../service/LocationsService";

function isNotEmpty(array: Array<any> | undefined) {
    return array && array.length > 0;
}

export const MswOverviewPage = () => {
    const [locations, setLocations] = useState<Array<ApiSpotInformation>>([]);

    // @ts-ignore
    const {user, token} = useUserAuth();

    useEffect(() => {
        const updateLocations = (newLocations: ApiSpotInformation[]) => setLocations(newLocations);
        locationsService.subscribe(updateLocations);

        return () => locationsService.unsubscribe(updateLocations);
    }, []);

    // initial loading
    useEffect(() => {
        if (!wasUserLoggedInBefore()) {
            locationsService.fetchData(token, false);
        }
    }, []);

    // load on user change
    useEffect(() => {
        if (!wasUserLoggedInBefore()) {
            locationsService.fetchData(token, false);
        } else if (user) {
            locationsService.fetchData(token, true);
        }
    }, [user])

    return <>
        <div className="App">
            <MswHeader/>
            {locations.length > 0 ? getContent() : <MswLoader/>}
            <MswFooter/>
        </div>
    </>;

    function getContent() {
        let riverSurfLocations = locations.filter(l => l.spotType === "RIVER_SURF");
        let bungeeSurfLocations = locations.filter(l => l.spotType === "BUNGEE_SURF");
        return <>
            <div className="surfspots">
                {isNotEmpty(riverSurfLocations) &&
                    <SpotList title="Riversurf" locations={riverSurfLocations}/>}
                {isNotEmpty(bungeeSurfLocations) &&
                    <SpotList title="Bungeesurf" locations={bungeeSurfLocations}/>}
            </div>
        </>;
    }
}

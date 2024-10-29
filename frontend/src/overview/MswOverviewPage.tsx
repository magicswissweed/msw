import "./MswOverviewPage.scss";
import React, {useEffect, useState} from "react";
import {MswHeader} from '../header/MswHeader';
import {MswFooter} from '../footer/MswFooter';
import {SpotList} from './spotlist/SpotList'
import {ApiSpotInformation, ApiSpotInformationList, SpotsApi} from '../gen/msw-api-ts';
import {MswLoader} from '../loader/MswLoader';
import {AxiosResponse} from 'axios';
import {useUserAuth, wasUserLoggedInBefore} from '../user/UserAuthContext';
import {authConfiguration} from '../api/config/AuthConfiguration';
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

    const writeSpotsToState = (res: AxiosResponse<ApiSpotInformationList, any>) => {
        if (res && res.data && res.data.riverSurfSpots && res.data.bungeeSurfSpots) {
            res.data.riverSurfSpots.forEach(l => l.spotType = "RIVER_SURF");
            res.data.bungeeSurfSpots.forEach(l => l.spotType = "BUNGEE_SURF");
            let allLocations = res.data.bungeeSurfSpots.concat(res.data.riverSurfSpots);
            locationsService.setLocations(allLocations);
        }
    };

    async function fetchData(showAllSpots: boolean) {
        if (showAllSpots) {
            let config = await authConfiguration(token);
            new SpotsApi(config).getAllSpots().then(writeSpotsToState);
        } else {
            new SpotsApi().getPublicSpots().then(writeSpotsToState);
        }
    }

    // initial loading
    useEffect(() => {
        if (!wasUserLoggedInBefore()) {
            fetchData(false);
        }
    }, []);

    // load on user change
    useEffect(() => {
        if (!wasUserLoggedInBefore()) {
            fetchData(false);
        } else if (user) {
            fetchData(true);
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

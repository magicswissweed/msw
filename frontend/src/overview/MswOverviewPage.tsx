import "./MswOverviewPage.scss";
import React, {useEffect, useState} from "react";
import {MswHeader} from '../header/MswHeader';
import {MswFooter} from '../footer/MswFooter';
import {SpotList} from './spotlist/SpotList'
import {ApiSpotInformationList, SpotsApi} from '../gen/msw-api-ts';
import {MswLoader} from '../loader/MswLoader';
import {AxiosResponse} from 'axios';
import {useUserAuth} from '../user/UserAuthContext';
import {authConfiguration} from '../api/config/AuthConfiguration';

interface MswOverviewPageState {
    data: ApiSpotInformationList | null
}

function isNotEmpty(array: Array<any> | undefined) {
    return array && array.length > 0;
}

export const MswOverviewPage = () => {
    const [state, setState] = useState<MswOverviewPageState>({data: null});

    // @ts-ignore
    const {user, token} = useUserAuth();
    const writeSpotsToState = (res: AxiosResponse<ApiSpotInformationList, any>) => {
        if (res && res.data && res.data.riverSurfSpots && res.data.bungeeSurfSpots) {
            setState({data: res.data});
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
        fetchData(false);
    }, []);

    // load on user change
    useEffect(() => {
        fetchData(user != undefined);
    }, [user])

    return <>
        <div className="App">
            <MswHeader/>
            {state.data ? getContent(state.data) : <MswLoader/>}
            <MswFooter/>
        </div>
    </>;

    function getContent(data: ApiSpotInformationList) {
        return <>
            <div className="surfspots">
                {isNotEmpty(data.riverSurfSpots) &&
                    <SpotList title="Riversurf" locations={data.riverSurfSpots!}/>}
                {isNotEmpty(data.bungeeSurfSpots) &&
                    <SpotList title="Bungeesurf" locations={data.bungeeSurfSpots!}/>}
            </div>
        </>;
    }
}

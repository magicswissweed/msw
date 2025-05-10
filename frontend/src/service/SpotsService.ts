import {ApiSpotInformation, HistoricalApi, SpotsApi, StationToApiHistoricalYears} from "../gen/msw-api-ts";
import {AxiosResponse} from "axios";
import {authConfiguration} from "../api/config/AuthConfiguration";
import {SpotModel} from "../model/SpotModel";

type SubscriberCallback = (spots: Array<SpotModel>) => void;

class SpotsService {
    private spots: Array<SpotModel> = [];
    private subscribers: Array<SubscriberCallback> = [];

    async fetchData(token: any, showAllSpots: boolean) {
        if (showAllSpots) {
            let config = await authConfiguration(token);
            // First load the most relevant info (fast)
            // -> then load additional infos (less important) -> shown to user as soon as it's loaded.
            new SpotsApi(config).getAllSpots()
                .then(this.writeSpotsToState)
                .then(() =>
                    new HistoricalApi(config).getHistoricalData()
                        .then(this.addHistoricalDataToState.bind(this))
                )
        } else {
            new SpotsApi().getPublicSpots().then(this.writeSpotsToState);
        }
    }

    deleteSpot(id: string): void {
        this.spots = this.spots.filter((spot) => spot.id !== id);
        this.notifySubscribers();
    }

    subscribe(callback: SubscriberCallback): void {
        this.subscribers.push(callback);
    }

    unsubscribe(callback: SubscriberCallback): void {
        this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    }

    private writeSpotsToState = (res: AxiosResponse<ApiSpotInformation[], any>) => {
        if (res && res.data) {
            let spots: Array<SpotModel> = res.data.map(s =>
                new SpotModel(
                    s.id,
                    s.name,
                    s.stationId,
                    s.spotType,
                    s.isPublic,
                    s.minFlow,
                    s.maxFlow,
                    s.station,
                    s.currentSample,
                    s.forecast,
                    undefined))
            this.setSpots(spots);
        }
    };

    private addHistoricalDataToState(res: AxiosResponse<StationToApiHistoricalYears[], any>) {
        if (res && res.data) {
            let spots = this.spots;
            spots.forEach(s => {
                    let filteredListByStationId =
                        res.data.filter(i => i.station === s.stationId);
                    s.historical = filteredListByStationId[0]?.historical;
                }
            )
            this.setSpots(spots);
        }
    }

    private setSpots(spots: Array<SpotModel>): void {
        this.spots = spots;
        this.notifySubscribers();
    }

    private notifySubscribers(): void {
        this.subscribers.forEach((callback) => callback(this.spots));
    }
}

export const spotsService = new SpotsService();

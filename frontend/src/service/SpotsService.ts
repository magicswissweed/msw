import {
    ApiForecast,
    ApiSample,
    ApiSpotInformation,
    ForecastApi,
    HistoricalApi,
    SpotsApi,
    StationToApiForecasts,
    StationToApiHistoricalYears
} from "../gen/msw-api-ts";
import {AxiosResponse} from "axios";
import {authConfiguration} from "../api/config/AuthConfiguration";
import {SpotModel} from "../model/SpotModel";

type SubscriberCallback = (spots: Array<SpotModel>) => void;

class SpotsService {
    private spots: Array<SpotModel> = [];
    private subscribers: Array<SubscriberCallback> = [];

    async fetchData(token: any) {
        let config = await authConfiguration(token);
        // First load the most relevant info (fast)
        // -> then load additional infos (less important) -> shown to user as soon as it's loaded.
        new SpotsApi(config).getSpots()
            .then(this.writeSpotsToState)
            .then(() =>
                new ForecastApi(config).getForecasts()
                    .then(this.addForecastsToState.bind(this))
            )
            .then(() =>
                new HistoricalApi(config).getHistoricalData()
                    .then(this.addHistoricalDataToState.bind(this))
            )
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
                    false,
                    undefined,
                    undefined))
            this.setSpots(spots);
        }
    };

    private addCurrentSampleToForecastLines(forecast: ApiForecast, currentSample: ApiSample) {
        if (forecast) {
            forecast.measuredData.push({timestamp: currentSample.timestamp, flow: currentSample.flow})
        }
        return forecast;
    }

    private addForecastsToState(res: AxiosResponse<StationToApiForecasts[], any>) {
        if (res && res.data) {
            const updatedSpots = this.spots.map(s => {
                const filteredListByStationId = res.data.filter(i => i.station === s.stationId);
                const newForecast = this.addCurrentSampleToForecastLines(
                    filteredListByStationId[0]?.forecast,
                    s.currentSample
                );
                // create new SpotModel so that react can see that something changed (updating a field is not enough)
                return new SpotModel(
                    s.id,
                    s.name,
                    s.stationId,
                    s.spotType,
                    s.isPublic,
                    s.minFlow,
                    s.maxFlow,
                    s.station,
                    s.currentSample,
                    true,
                    newForecast,
                    s.historical
                );
            });

            this.setSpots(updatedSpots);
        }
    }

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

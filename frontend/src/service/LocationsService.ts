import {
    ApiLineEntry,
    ApiSpotInformation,
    ApiSpotInformationList,
    ApiSpotSpotTypeEnum,
    SpotsApi
} from "../gen/msw-api-ts";
import {AxiosResponse} from "axios";
import {authConfiguration} from "../api/config/AuthConfiguration";

type SubscriberCallback = (locations: Array<ApiSpotInformation>) => void;

export enum FlowColorEnum {
    GREEN = "green", ORANGE = "orange", RED = "red"
}

class LocationService {
    private locations: Array<ApiSpotInformation> = [];
    private subscribers: Array<SubscriberCallback> = [];

    async fetchData(token: any, showAllSpots: boolean) {
        if (showAllSpots) {
            let config = await authConfiguration(token);
            new SpotsApi(config).getAllSpots().then(this.writeSpotsToState);
        } else {
            new SpotsApi().getPublicSpots().then(this.writeSpotsToState);
        }
    }

    deleteLocation(id: string): void {
        this.locations = this.locations.filter((location) => location.id !== id);
        this.notifySubscribers();
    }

    subscribe(callback: SubscriberCallback): void {
        this.subscribers.push(callback);
    }

    unsubscribe(callback: SubscriberCallback): void {
        this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    }

    private writeSpotsToState = (res: AxiosResponse<ApiSpotInformationList, any>) => {
        if (res && res.data && res.data.riverSurfSpots && res.data.bungeeSurfSpots) {
            res.data.riverSurfSpots.forEach(l => l.spotType = ApiSpotSpotTypeEnum.RiverSurf);
            res.data.bungeeSurfSpots.forEach(l => l.spotType = ApiSpotSpotTypeEnum.BungeeSurf);
            let allLocations = res.data.bungeeSurfSpots.concat(res.data.riverSurfSpots);
            this.setLocations(allLocations);
        }
    };

    private setLocations(locations: Array<ApiSpotInformation>): void {
        this.locations = locations;
        this.notifySubscribers();
    }

    private notifySubscribers(): void {
        this.subscribers.forEach((callback) => callback(this.locations));
    }

    public getFlowColorEnum(spot: ApiSpotInformation, _flow: number): FlowColorEnum {
        if (this.isInSurfableRange(spot, _flow)) {
            return FlowColorEnum.GREEN;
        }

        try {
            if (this.forecastShowsTendencyToBecomeGood(spot, _flow)) {
                return FlowColorEnum.ORANGE;
            }
        } catch (e) {
            // if error -> red
        }

        return FlowColorEnum.RED;
    }

    private forecastShowsTendencyToBecomeGood(spot: ApiSpotInformation, flow: number) {
        function getMinFlowInLine(min?: Array<ApiLineEntry>) {
            if (!min || min.length === 0) return Number.POSITIVE_INFINITY;
            const flows = min
                .map(entry => entry.flow)
                .filter(f => f != undefined);
            return flows.length > 0 ? Math.min(...flows) : Number.POSITIVE_INFINITY;
        }

        function getMaxFlowInLine(max?: Array<ApiLineEntry>) {
            if (!max || max.length === 0) return Number.NEGATIVE_INFINITY;
            const flows = max
                .map(entry => entry.flow)
                .filter(f => f != undefined);
            return flows.length > 0 ? Math.max(...flows) : Number.NEGATIVE_INFINITY;
        }

        const minFlowInForecast = getMinFlowInLine(spot.forecast.min);
        const maxFlowInForecast = getMaxFlowInLine(spot.forecast.max);

        return this.isInSurfableRange(spot, minFlowInForecast) ||
            this.isInSurfableRange(spot, maxFlowInForecast) ||
            (flow < spot.minFlow && maxFlowInForecast > spot.minFlow) ||
            (flow > spot.maxFlow && minFlowInForecast < spot.maxFlow);
    }

    private isInSurfableRange(location: ApiSpotInformation, _flow: number) {
        return _flow > location.minFlow && _flow < location.maxFlow;
    }
}

export const locationsService = new LocationService();

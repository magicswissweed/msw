import {ApiSpotInformation, ApiSpotInformationList, ApiSpotSpotTypeEnum, SpotsApi} from "../gen/msw-api-ts";
import {AxiosResponse} from "axios";
import {authConfiguration} from "../api/config/AuthConfiguration";

type SubscriberCallback = (locations: Array<ApiSpotInformation>) => void;

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
}

export const locationsService = new LocationService();

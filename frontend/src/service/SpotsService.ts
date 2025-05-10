import {ApiSpotInformation, SpotsApi} from "../gen/msw-api-ts";
import {AxiosResponse} from "axios";
import {authConfiguration} from "../api/config/AuthConfiguration";

type SubscriberCallback = (spots: Array<ApiSpotInformation>) => void;

class SpotsService {
    private spots: Array<ApiSpotInformation> = [];
    private subscribers: Array<SubscriberCallback> = [];

    async fetchData(token: any, showAllSpots: boolean) {
        if (showAllSpots) {
            let config = await authConfiguration(token);
            new SpotsApi(config).getAllSpots().then(this.writeSpotsToState);
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
        if (res && res.data && res.data) {
            this.setSpots(res.data);
        }
    };

    private setSpots(spots: Array<ApiSpotInformation>): void {
        this.spots = spots;
        this.notifySubscribers();
    }

    private notifySubscribers(): void {
        this.subscribers.forEach((callback) => callback(this.spots));
    }
}

export const spotsService = new SpotsService();

import {ApiSpotInformation} from "../gen/msw-api-ts";

type SubscriberCallback = (locations: Array<ApiSpotInformation>) => void;

class LocationService {
    private locations: Array<ApiSpotInformation> = [];
    private subscribers: Array<SubscriberCallback> = [];

    setLocations(locations: Array<ApiSpotInformation>): void {
        this.locations = locations;
        this.notifySubscribers();
    }

    getLocations(): Array<ApiSpotInformation> {
        return this.locations;
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

    private notifySubscribers(): void {
        this.subscribers.forEach((callback) => callback(this.locations));
    }
}

export const locationsService = new LocationService();
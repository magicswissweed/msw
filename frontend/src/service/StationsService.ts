import {ApiStation, StationApi} from "../gen/msw-api-ts";
import {AxiosResponse} from "axios";

class StationsService {
    private stations: Array<ApiStation> = [];

    async fetchData() {
        new StationApi().getStations()
            .then(this.writeStationsToState)
    }

    private writeStationsToState = (res: AxiosResponse<ApiStation[], any>) => {
        if (res && res.data) {
            this.stations = res.data;
        }
    };

    getStations() {
        return this.stations;
    }
}

export const stationsService = new StationsService();

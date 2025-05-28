import {
    ApiForecast,
    ApiHistoricalYears,
    ApiSample,
    ApiSpotInformationSpotTypeEnum,
    ApiStation
} from "../gen/msw-api-ts";

export class SpotModel {
    id: string;
    name: string;
    stationId: number;
    spotType: ApiSpotInformationSpotTypeEnum;
    isPublic: boolean;
    minFlow: number;
    maxFlow: number;
    station: ApiStation;
    currentSample: ApiSample;
    forecastLoaded: boolean;
    forecast: ApiForecast | undefined;
    historical: ApiHistoricalYears | undefined;

    constructor(
        id: string,
        name: string,
        stationId: number,
        spotType: ApiSpotInformationSpotTypeEnum,
        isPublic: boolean,
        minFlow: number,
        maxFlow: number,
        station: ApiStation,
        currentSample: ApiSample,
        forecastLoaded: boolean,
        forecast: ApiForecast | undefined,
        historical: ApiHistoricalYears | undefined) {
        this.id = id;
        this.name = name;
        this.stationId = stationId;
        this.spotType = spotType;
        this.isPublic = isPublic;
        this.minFlow = minFlow;
        this.maxFlow = maxFlow;
        this.station = station;
        this.currentSample = currentSample;
        this.forecastLoaded = forecastLoaded;
        this.forecast = forecast;
        this.historical = historical;
    }
}

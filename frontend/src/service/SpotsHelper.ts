import {ApiLineEntry, ApiSpotInformation} from "../gen/msw-api-ts";


export enum FlowColorEnum {
    GREEN = "green", ORANGE = "orange", RED = "red"
}

export function getFlowColorEnum(spot: ApiSpotInformation, _flow: number): FlowColorEnum {
    if (isInSurfableRange(spot, _flow)) {
        return FlowColorEnum.GREEN;
    }

    try {
        if (forecastShowsTendencyToBecomeGood(spot, _flow)) {
            return FlowColorEnum.ORANGE;
        }
    } catch (e) {
        // if error -> red
    }

    return FlowColorEnum.RED;
}

export function forecastShowsTendencyToBecomeGood(spot: ApiSpotInformation, flow: number) {
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

    return isInSurfableRange(spot, minFlowInForecast) ||
        isInSurfableRange(spot, maxFlowInForecast) ||
        (flow < spot.minFlow && maxFlowInForecast > spot.minFlow) ||
        (flow > spot.maxFlow && minFlowInForecast < spot.maxFlow);
}

export function isInSurfableRange(spots: ApiSpotInformation, _flow: number) {
    return _flow > spots.minFlow && _flow < spots.maxFlow;
}

import '../base-graph/MswGraph.scss'
import {ComposedChart, Legend, ResponsiveContainer, YAxis} from 'recharts';
import {useEffect, useState} from 'react';
import {ApiSample, ApiSpotInformation, SampleApi} from '../../../../../gen/msw-api-ts';
import {authConfiguration} from '../../../../../api/config/AuthConfiguration';
import {AxiosResponse} from 'axios';
import {useUserAuth} from '../../../../../user/UserAuthContext';
import {
    DATA_KEY_MEASURED,
    getCartesianGrid,
    getCurrentTimeReferenceLine,
    getMeasuredLine,
    getMinMaxReferenceLines,
    getReferenceArea,
    getTooltip,
    getXAxis,
    LINE_NAME_MEASURED,
    MswGraphProps,
    NormalizedDataItem,
    normalizeGraphDataLine
} from "../base-graph/MswGraph";

interface MswLastMeasurementsState {
    samples: ApiSample[]
}

export const MswLastMeasurementsGraph = (props: MswGraphProps) => {
    const [state, setState] = useState<MswLastMeasurementsState>({samples: []});

    // @ts-ignore
    const {token} = useUserAuth();

    let spot: ApiSpotInformation;
    let aspectRatio: number;
    let withLegend: boolean;
    let withXAxis: boolean;
    let withYAxis: boolean;
    let withMinMaxReferenceLines: boolean;
    let withTooltip: boolean;

    spot = props.spot;
    aspectRatio = props.aspectRatio;
    withLegend = props.withLegend === true;
    withXAxis = props.withXAxis === true;
    withYAxis = props.withYAxis === true;
    withMinMaxReferenceLines = props.withMinMaxReferenceLines === true;
    withTooltip = props.withTooltip === true;

    // TODO: this is likely being executed twice per Component (componentents are mounted twice in react dev mode)
    //  also it is executed twice (so 4 times in total) because we have the big graph and the mini graph as seperate components.
    //  To fix this: fetch last40DaysGraphData once on startup for all spots that don't have a forecast and add to SpotModel.
    //  Also: replace ApiSpotInformation with SpotModel
    // eslint-disable-next-line
    // needed (also the empty array), because otherwise the backend would get polled endlessly
    // eslint-disable-next-line
    useEffect(() => {
        fetchLast40DaysSamples()
    }, []);

    async function fetchLast40DaysSamples() {
        let config = await authConfiguration(token);
        new SampleApi(config).getLast40DaysSamples(spot.stationId!)
            .then((res: AxiosResponse<ApiSample[], any>) => {
                if (res && res.data) {
                    setState({samples: res.data});
                }
            });
    }

    if (state.samples.length === 0) {
        return <>
            <div>Detailed Graph not possible at the moment...</div>
        </>
    }

    function roundToOneDecimal(value: unknown): number {
        // @ts-ignore
        return Math.round(value * 10) / 10;
    }

    let normalizedGraphData: NormalizedDataItem[] = normalizeGraphDataLine(state.samples, DATA_KEY_MEASURED);
    normalizedGraphData = normalizedGraphData.map(item => ({
        ...item,
        [DATA_KEY_MEASURED]: roundToOneDecimal(item[DATA_KEY_MEASURED])
    }));

    const ticks: number[] = getTicks();

    return <>
        <ResponsiveContainer className="graph" width="100%" aspect={aspectRatio}>
            <ComposedChart data={normalizedGraphData}>
                {getReferenceArea(spot)}
                {getCurrentTimeReferenceLine()}
                {getMeasuredLine()}
                {getCartesianGrid()}
                {getXAxis(ticks, withXAxis, v => new Date(v).getDate() + "." + (new Date(v).getMonth() + 1) + ".")}

                {withMinMaxReferenceLines && getMinMaxReferenceLines(spot)}
                {withTooltip && getTooltip()}
                {withYAxis && <YAxis/>}
                {withLegend && getLegend()}
            </ComposedChart>
        </ResponsiveContainer>
    </>

    function getTicks() {
        const nrOfTicks = 6;
        const nrOfDays = 50;
        const oneDayInMs = 24 * 60 * 60 * 1000;

        return Array.from(
            {length: nrOfTicks},
            (_, i) => Date.now() - oneDayInMs * i * (nrOfDays / nrOfTicks)
        );
    }

    function getLegend() {
        return <Legend
            payload={[
                {type: "line", value: LINE_NAME_MEASURED, color: "green"},
            ]}
            wrapperStyle={{textTransform: 'uppercase'}}
        />;
    }
}

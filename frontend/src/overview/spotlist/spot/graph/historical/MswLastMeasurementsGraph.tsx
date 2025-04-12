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

    let location: ApiSpotInformation;
    let aspectRatio: number;
    let withLegend: boolean;
    let withXAxis: boolean;
    let withYAxis: boolean;
    let withMinMaxReferenceLines: boolean;
    let withTooltip: boolean;

    location = props.location;
    aspectRatio = props.aspectRatio;
    withLegend = props.withLegend === true;
    withXAxis = props.withXAxis === true;
    withYAxis = props.withYAxis === true;
    withMinMaxReferenceLines = props.withMinMaxReferenceLines === true;
    withTooltip = props.withTooltip === true;

    // eslint-disable-next-line
    // needed (also the empty array), because otherwise the backend would get polled endlessly
    // eslint-disable-next-line
    useEffect(() => {
        fetchLast40DaysSamples()
    }, []);

    async function fetchLast40DaysSamples() {
        let config = await authConfiguration(token);
        new SampleApi(config).getLast40DaysSamples(location.stationId!)
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

    let normalizedGraphData: NormalizedDataItem[] = normalizeGraphDataLine(state.samples, DATA_KEY_MEASURED);

    const ticks: number[] = getTicks();

    return <>
        <ResponsiveContainer className="graph" width="100%" aspect={aspectRatio}>
            <ComposedChart data={normalizedGraphData}>
                {getReferenceArea(location)}
                {getCurrentTimeReferenceLine()}
                {getMeasuredLine()}
                {getCartesianGrid()}
                {getXAxis(ticks, withXAxis, v => new Date(v).getDate() + "." + (new Date(v).getMonth() + 1) + ".")}

                {withMinMaxReferenceLines && getMinMaxReferenceLines(location)}
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
        />;
    }
}

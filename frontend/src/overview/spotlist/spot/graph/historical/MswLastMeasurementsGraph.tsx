import '../base-graph/MswGraph.scss'
import {ComposedChart, Legend, ResponsiveContainer,} from 'recharts';
import {useState} from 'react';
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
    getYAxis,
    LINE_NAME_MEASURED,
    MswGraphProps,
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

    fetchLast40DaysSamples();

    async function fetchLast40DaysSamples() {
        let config = await authConfiguration(token);
        new SampleApi(config).getLast40DaysSamples(location.stationId!)
            .then((res: AxiosResponse<ApiSample[], any>) => {
                if (res && res.data) {
                    setState({samples: res.data});
                }
            });
    }

    if (state.samples.length == 0) {
        return <>
            <div>Detailed Graph not possible at the moment...</div>
        </>
    }

    let normalizedGraphData: any[] = normalizeGraphDataLine(state.samples, DATA_KEY_MEASURED);

    const ticks = getTicks();

    const from = ticks[0];
    const to = ticks[ticks.length - 1];

    return <>
        <ResponsiveContainer className="graph" width="100%" aspect={aspectRatio}>
            <ComposedChart data={normalizedGraphData}>
                {getReferenceArea(location)}
                {getCurrentTimeReferenceLine()}
                {getMeasuredLine()}
                {getCartesianGrid()}
                {getXAxis(from, to, ticks, withXAxis, v => new Date(v).getDate() + ".")}

                {withMinMaxReferenceLines && getMinMaxReferenceLines(location)}
                {withTooltip && getTooltip()}
                {withYAxis && getYAxis(location.minFlow!, location.maxFlow!)}
                {withLegend && getLegend()}
            </ComposedChart>
        </ResponsiveContainer>
    </>

    function getTicks() {
        let nrOfTicks = 10;
        let nrOfDays = 50;

        let oneDay = 24 * 60 * 60 * 1000;

        let ticks: number[] = [];
        for (let i = 0; i < nrOfTicks; i++) {
            ticks[i] = Date.now() - oneDay * (i - 1) * (nrOfDays / nrOfTicks);
        }

        return ticks;
    }

    function getLegend() {
        return <Legend
            payload={[
                {type: "line", value: LINE_NAME_MEASURED, color: "green"},
            ]}
        />;
    }
}
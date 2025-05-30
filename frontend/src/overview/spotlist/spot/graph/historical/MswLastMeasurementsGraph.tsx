import '../base-graph/MswGraph.scss'
import {ComposedChart, Legend, ResponsiveContainer, YAxis} from 'recharts';
import {ApiSpotInformation} from '../../../../../gen/msw-api-ts';
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
import {MswLoader} from "../../../../../loader/MswLoader";

export const MswLastMeasurementsGraph = (props: MswGraphProps) => {
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

    if (props.spot.last40DaysLoaded) {
        if (props.spot.last40Days === undefined || props.spot.last40Days.length === 0) {
            return <div>Detailed Graph not possible at the moment...</div>
        }
    } else {
        return <MswLoader/>
    }


    function roundToOneDecimal(value: unknown): number {
        // @ts-ignore
        return Math.round(value * 10) / 10;
    }

    let normalizedGraphData: NormalizedDataItem[] = normalizeGraphDataLine(props.spot.last40Days, DATA_KEY_MEASURED);
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

import '../base-graph/MswGraph.scss'
import {Area, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import React, {Component} from 'react';
import {ApiHistoricalYears, ApiLineEntry} from '../../../../../gen/msw-api-ts';
import {
    DATA_KEY_MEDIAN,
    getCartesianGrid,
    getCurrentTimeReferenceLine,
    getMinMaxReferenceLines,
    getReferenceArea,
    LINE_NAME_MEDIAN,
    MswGraphProps,
    NormalizedDataItem,
    normalizeGraphDataLine
} from "../base-graph/MswGraph";
import {SpotModel} from "../../../../../model/SpotModel";

const DATA_KEY_25_PERCENTILE = "twentyFivePercentile";
const DATA_KEY_75_PERCENTILE = "seventyFivePercentile";
const DATA_KEY_MINIMUM = "minimum";
const DATA_KEY_MAXIMUM = "maximum";
const DATA_KEY_CURRENT_YEAR = "currentYear";

const TEMPORARY_DATA_KEY_FLOW = "flow";

export let LINE_NAME_CURRENT_YEAR = "Current year";

export class MswHistoricalYearsGraph extends Component<MswGraphProps> {

    private readonly spot: SpotModel;
    private readonly aspectRatio: number;
    private readonly withLegend: boolean;
    private readonly withYAxis: boolean;
    private readonly withXAxis: boolean;
    private readonly withMinMaxReferenceLines: boolean;
    private readonly withTooltip: boolean;

    constructor(props: MswGraphProps) {
        super(props);
        this.spot = props.spot;
        this.aspectRatio = props.aspectRatio;
        this.withLegend = props.withLegend === true;
        this.withYAxis = props.withYAxis === true;
        this.withXAxis = props.withXAxis === true;
        this.withMinMaxReferenceLines = props.withMinMaxReferenceLines === true;
        this.withTooltip = props.withTooltip === true;
    }

    render() {
        if (!this.spot.historical) {
            return <>
                <div>Detailed Graph not possible at the moment...</div>
            </>
        }

        let normalizedGraphData: NormalizedDataItem[] = this.normalizeGraphData(this.spot.historical!);

        return <>
            <ResponsiveContainer className="graph" width="100%" aspect={this.aspectRatio}>
                <ComposedChart data={normalizedGraphData}>
                    {getReferenceArea(this.spot)}
                    {getCurrentTimeReferenceLine()}

                    <Area
                        dataKey="minMaxRange"
                        name="Min-Max"
                        strokeWidth={0}
                        fill="#75d4d9"
                    />
                    <Area
                        dataKey="firstToThirdQuartile"
                        name="25.-75. Percentile"
                        strokeWidth={0}
                        fill="#1e9196"
                    />

                    <Line type="monotone"
                          dataKey="medianRounded"
                          stroke="blue"
                          dot={false}
                          name={LINE_NAME_MEDIAN}
                          activeDot={{stroke: '#029ca3', strokeWidth: 1, r: 4}}/>

                    <Line type="monotone"
                          dataKey="currentYearRounded"
                          stroke="green"
                          dot={false}
                          name={LINE_NAME_CURRENT_YEAR}
                          activeDot={{stroke: 'green', strokeWidth: 1, r: 4}}/>

                    {getCartesianGrid()}
                    <XAxis
                        type="number"
                        dataKey="datetime"
                        domain={[new Date(2025, 0, 1).getTime(), new Date(2025, 11, 31).getTime()]} // Full year
                        scale="time"
                        ticks={this.getTicks()}
                        tickFormatter={v => new Date(v).toLocaleString('de-CH', {month: 'short'})}
                        minTickGap={1}
                        hide={!this.withXAxis}
                        tick={{dx: 20}}
                    />

                    {this.withMinMaxReferenceLines && getMinMaxReferenceLines(this.spot)}
                    {this.withTooltip && this.getHistoricalTooltip()}
                    {this.withYAxis && <YAxis domain={[0, this.spot.maxFlow!]}/>}
                    {this.withLegend && this.getLegend()}
                </ComposedChart>
            </ResponsiveContainer>
        </>
    }

    private getHistoricalTooltip() {
        // @ts-ignore
        const MswTooltip = ({active, payload, label}) => {
            if (active && payload && payload.length) {

                let flowStr: string = "";
                let color: string = "black";
                for (let payloadItem of payload) {
                    if (payloadItem.dataKey === "medianRounded") {
                        flowStr = "Median: " + payloadItem.value;
                        color = payloadItem.stroke;
                    }
                }

                return (
                    <div className="tooltip">
                        <p className="tooltip_timestamp">{label.getDate() + "." + (label.getMonth() + 1) + ". " + label.getHours() + ":00"}</p>
                        <p className="tooltip_value" style={{color: color}}>{flowStr}</p>
                    </div>
                );
            }

            return null;
        };

        // @ts-ignore
        return <Tooltip content={MswTooltip}/>;
    }

    private getTicks() {
        const nrOfTicks = 12;
        return Array.from(
            {length: nrOfTicks},
            (_, i) => new Date(2025, i, 1).getTime()
        );
    }

    private getLegend() {
        return <Legend
            payload={[
                {type: "line", value: LINE_NAME_CURRENT_YEAR, color: "green"},
                {type: "line", value: LINE_NAME_MEDIAN, color: "blue"},
                {type: "square", value: "25.-75. percentile", color: "#1e9196"},
                {type: "square", value: "min-max", color: "#75d4d9"},
            ]}
            wrapperStyle={{textTransform: 'uppercase'}}
        />;
    }

    private normalizeGraphData(historicalYearsData: ApiHistoricalYears): NormalizedDataItem[] {
        let normalizedData: NormalizedDataItem[] = [];

        normalizedData.push(...normalizeGraphDataLine(historicalYearsData.currentYear!, DATA_KEY_CURRENT_YEAR));
        normalizedData = this.mergeDataLines(normalizedData, this.getSimpleGraphDataLine(historicalYearsData.median!), DATA_KEY_MEDIAN);
        normalizedData = this.mergeDataLines(normalizedData, this.getSimpleGraphDataLine(historicalYearsData.twentyFivePercentile!), DATA_KEY_25_PERCENTILE);
        normalizedData = this.mergeDataLines(normalizedData, this.getSimpleGraphDataLine(historicalYearsData.seventyFivePercentile!), DATA_KEY_75_PERCENTILE);
        normalizedData = this.mergeDataLines(normalizedData, this.getSimpleGraphDataLine(historicalYearsData.min!), DATA_KEY_MINIMUM);
        normalizedData = this.mergeDataLines(normalizedData, this.getSimpleGraphDataLine(historicalYearsData.max!), DATA_KEY_MAXIMUM);

        // area for percentiles
        normalizedData = normalizedData.map((d) => ({
            ...d,
            firstToThirdQuartile:
                d[DATA_KEY_25_PERCENTILE] !== undefined && d[DATA_KEY_75_PERCENTILE] !== undefined
                    ? [Math.round(d[DATA_KEY_25_PERCENTILE] as number), Math.round(d[DATA_KEY_75_PERCENTILE] as number)]
                    : [],
        }));

        // area for min-max
        normalizedData = normalizedData.map((d) => ({
            ...d,
            minMaxRange:
                d[DATA_KEY_MINIMUM] !== undefined && d[DATA_KEY_MAXIMUM] !== undefined
                    ? [Math.round(d[DATA_KEY_MINIMUM] as number), Math.round(d[DATA_KEY_MAXIMUM] as number)]
                    : [],
        }));

        normalizedData = normalizedData.map((d) => ({
            ...d,
            medianRounded:
                Math.round(d[DATA_KEY_MEDIAN] as number)
        }));

        normalizedData = normalizedData.map((d) => ({
            ...d,
            currentYearRounded:
                d[DATA_KEY_CURRENT_YEAR] !== undefined
                    ? Math.round(d[DATA_KEY_CURRENT_YEAR] as number)
                    : undefined
        }));

        return normalizedData;
    }

    private getSimpleGraphDataLine(line: ApiLineEntry[]): NormalizedDataItem[] {
        return normalizeGraphDataLine(line, TEMPORARY_DATA_KEY_FLOW);
    }

    private mergeDataLines(left: NormalizedDataItem[], right: NormalizedDataItem[], dataKey: string) {
        let output: NormalizedDataItem[] = [];

        left.forEach(leftItem => {
            let filteredRight = right.filter(rightItem => leftItem.datetime.getTime() === rightItem.datetime.getTime());
            let leftItemIsContainedInRightList: boolean = filteredRight.length > 0;
            if (leftItemIsContainedInRightList) {
                leftItem[dataKey] = filteredRight[0][TEMPORARY_DATA_KEY_FLOW];
            }
            output.push(leftItem);
        });

        right.forEach(rightItem => {
            let filteredOutput = output.filter(outputItem => rightItem.datetime.getTime() === outputItem.datetime.getTime());
            let rightItemIsContainedInOutputList: boolean = filteredOutput.length > 0;
            if (!rightItemIsContainedInOutputList) {
                let obj: NormalizedDataItem = {datetime: rightItem.datetime};
                obj[dataKey] = rightItem.flow;
                output.push(obj);
            }
        });

        return output;
    }
}

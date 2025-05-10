import '../base-graph/MswGraph.scss'
import {Area, ComposedChart, Legend, Line, ReferenceDot, ResponsiveContainer, YAxis} from 'recharts';
import React, {Component} from 'react';
import {ApiForecast, ApiLineEntry, ApiSpotInformation} from '../../../../../gen/msw-api-ts';
import {
    DATA_KEY_MEASURED,
    DATA_KEY_MEDIAN,
    getCartesianGrid,
    getCurrentTimeReferenceLine,
    getMeasuredLine,
    getMinMaxReferenceLines,
    getReferenceArea,
    getTooltip,
    getXAxis,
    LINE_NAME_MEASURED,
    LINE_NAME_MEDIAN,
    MswGraphProps,
    NormalizedDataItem,
    normalizeGraphDataLine
} from "../base-graph/MswGraph";

const DATA_KEY_25_PERCENTILE = "twentyFivePercentile";
const DATA_KEY_75_PERCENTILE = "seventyFivePercentile";
const DATA_KEY_MINIMUM = "minimum";
const DATA_KEY_MAXIMUM = "maximum";

const TEMPORARY_DATA_KEY_FLOW = "flow";

export class MswForecastGraph extends Component<MswGraphProps> {

    private readonly spot: ApiSpotInformation;
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
        if (!this.spot.forecast) {
            return <>
                <div>Detailed Forecast not possible at the moment...</div>
            </>
        }

        let normalizedGraphData: NormalizedDataItem[] = this.normalizeGraphData(this.spot.forecast!);

        const ticks = this.getTicks(normalizedGraphData);

        return <>
            <ResponsiveContainer className="graph" width="100%" aspect={this.aspectRatio}>
                <ComposedChart data={normalizedGraphData}>
                    {getReferenceArea(this.spot)}
                    {getCurrentTimeReferenceLine()}
                    <ReferenceDot x={new Date(this.spot.forecast!.timestamp!).getTime()}
                                  y={this.spot.forecast.median!
                                      .filter((v) => new Date(v.timestamp!).getMonth() === new Date(this.spot.forecast!.timestamp!).getMonth())
                                      .filter((v) => new Date(v.timestamp!).getDay() === new Date(this.spot.forecast!.timestamp!).getDay())
                                      .filter((v) => new Date(v.timestamp!).getHours() === new Date(this.spot.forecast!.timestamp!).getHours())[0]
                                      .flow
                                  }
                                  stroke="gold"
                                  r={6}
                    />

                    <Area
                        dataKey="minMaxRange"
                        strokeWidth={0}
                        fill="#75d4d9"
                    />
                    <Area
                        dataKey="percentileRange"
                        strokeWidth={0}
                        fill="#1e9196"
                    />

                    <Line type="monotone"
                          dataKey={DATA_KEY_MEDIAN}
                          stroke="blue"
                          dot={false}
                          name={LINE_NAME_MEDIAN}
                          activeDot={{stroke: '#029ca3', strokeWidth: 1, r: 4}}/>
                    {getMeasuredLine()}
                    {getCartesianGrid()}
                    {getXAxis(ticks, this.withXAxis, v => new Date(v).toLocaleString('de-CH', {weekday: 'short'}))}

                    {this.withMinMaxReferenceLines && getMinMaxReferenceLines(this.spot)}
                    {this.withTooltip && getTooltip()}
                    {this.withYAxis && <YAxis/>}
                    {this.withLegend && this.getLegend()}
                </ComposedChart>
            </ResponsiveContainer>
        </>
    }

    private getTicks(normalizedGraphData: NormalizedDataItem[]) {
        const nrOfTicks = 8;
        const oneDayInMs = 24 * 60 * 60 * 1000;
        let firstDayMidnight = new Date(normalizedGraphData[0].datetime).setHours(0, 0, 0, 1);
        return Array.from(
            {length: nrOfTicks},
            (_, i) => firstDayMidnight + i * oneDayInMs
        );
    }

    private getLegend() {
        /* payload is only necessary to get rid of unneccessary double legend entry because forecastFlow0 and forecastFlow1 are both named Min/Max */
        return <Legend
            payload={[
                {type: "line", value: LINE_NAME_MEASURED, color: "green"},
                {type: "line", value: LINE_NAME_MEDIAN, color: "blue"},
                {type: "square", value: "25.-75. percentile", color: "#1e9196"},
                {type: "square", value: "min-max", color: "#75d4d9"},
            ]}
            wrapperStyle={{textTransform: 'uppercase'}}
        />;
    }

    private normalizeGraphData(forecast: ApiForecast): NormalizedDataItem[] {
        let normalizedData: NormalizedDataItem[] = [];

        normalizedData.push(...normalizeGraphDataLine(forecast.measuredData!, DATA_KEY_MEASURED));
        normalizedData = this.mergeDataLines(normalizedData, this.getSimpleGraphDataLine(forecast.median!), DATA_KEY_MEDIAN);
        normalizedData = this.mergeDataLines(normalizedData, this.getSimpleGraphDataLine(forecast.twentyFivePercentile!), DATA_KEY_25_PERCENTILE);
        normalizedData = this.mergeDataLines(normalizedData, this.getSimpleGraphDataLine(forecast.seventyFivePercentile!), DATA_KEY_75_PERCENTILE);
        normalizedData = this.mergeDataLines(normalizedData, this.getSimpleGraphDataLine(forecast.min!), DATA_KEY_MINIMUM);
        normalizedData = this.mergeDataLines(normalizedData, this.getSimpleGraphDataLine(forecast.max!), DATA_KEY_MAXIMUM);

        // area for percentiles
        normalizedData = normalizedData.map((d) => ({
            ...d,
            percentileRange:
                d[DATA_KEY_25_PERCENTILE] !== undefined && d[DATA_KEY_75_PERCENTILE] !== undefined
                    ? [d[DATA_KEY_25_PERCENTILE], d[DATA_KEY_75_PERCENTILE]]
                    : [],
        }));

        // area for min-max
        normalizedData = normalizedData.map((d) => ({
            ...d,
            minMaxRange:
                d[DATA_KEY_MINIMUM] !== undefined && d[DATA_KEY_MAXIMUM] !== undefined
                    ? [d[DATA_KEY_MINIMUM], d[DATA_KEY_MAXIMUM]]
                    : [],
        }));

        return normalizedData;
    }

    private getSimpleGraphDataLine(forecastLine: ApiLineEntry[]): NormalizedDataItem[] {
        return normalizeGraphDataLine(forecastLine, TEMPORARY_DATA_KEY_FLOW);
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

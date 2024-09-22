import './MswForecastGraph.scss'
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Label,
    Legend,
    Line,
    ReferenceArea,
    ReferenceDot,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import React, {Component} from 'react';
import {ApiForecast, ApiForecastLineEntry, ApiSpotInformation} from '../../../../gen/msw-api-ts';

interface MswForecastGraphProps {
    location: ApiSpotInformation,
    isMini: boolean
}

const DATA_KEY_MEDIAN = "median";
const DATA_KEY_MEASURED = "measured";
const DATA_KEY_25_PERCENTILE = "twentyFivePercentile";
const DATA_KEY_75_PERCENTILE = "seventyFivePercentile";
const DATA_KEY_MINIMUM = "minimum";
const DATA_KEY_MAXIMUM = "maximum";

const LINE_NAME_MEASURED = "Gemessen";
let LINE_NAME_MEDIAN = "Median";

type NormalizedDataItem = { datetime: Date, [lineName: string]: unknown; };

const TEMPORARY_DATA_KEY_FLOW = "flow";

export class MswForecastGraph extends Component<MswForecastGraphProps> {

    private readonly location: ApiSpotInformation;
    private readonly isMini: boolean;

    constructor(props: MswForecastGraphProps) {
        super(props);
        this.location = props.location;
        this.isMini = props.isMini;
    }

    render() {
        if (!this.location.forecast) {
            return <>
                <div>Detailed Forecast not possible at the moment...</div>
            </>
        }

        let normalizedGraphData: any[] = this.normalizeGraphData(this.location.forecast!);

        const from = normalizedGraphData[0].datetime;
        const to = normalizedGraphData[normalizedGraphData.length - 1].datetime;
        let firstDayMidnight = new Date(from).setHours(0, 0, 0, 1);
        let firstDayMidnightDate = new Date(firstDayMidnight);
        const ticks = [
            firstDayMidnight,
            firstDayMidnightDate.setHours(24, 0, 0, 0),
            firstDayMidnightDate.setHours(24, 0, 0, 0),
            firstDayMidnightDate.setHours(24, 0, 0, 0),
            firstDayMidnightDate.setHours(24, 0, 0, 0),
            firstDayMidnightDate.setHours(24, 0, 0, 0),
            firstDayMidnightDate.setHours(24, 0, 0, 0),
            firstDayMidnightDate.setHours(24, 0, 0, 0),
        ]

        let showXAxis = true;
        let showMinMaxReferenceLines = true;
        let showTooltip = true;
        let showYAxis = true;
        let showLegend = true;


        if (this.isMini) {
            showXAxis = false;
            showMinMaxReferenceLines = false;
            showTooltip = false;
            showYAxis = false;
            showLegend = false;
        }

        return <>
            <ResponsiveContainer className="graph" width="100%" aspect={this.isMini ? 3 : 2}>
                <ComposedChart data={normalizedGraphData}>
                    <ReferenceArea y1={this.location.minFlow}
                                   y2={this.location.maxFlow}
                                   ifOverflow="extendDomain"
                                   fill="green"/>
                    <ReferenceLine x={Date.now()} stroke="#666666"/>
                    <ReferenceDot x={new Date(this.location.forecast!.timestamp!).getTime()}
                                  y={this.location.forecast.median!
                                      .filter((v) => new Date(v.timestamp!).getMonth() === new Date(this.location.forecast!.timestamp!).getMonth())
                                      .filter((v) => new Date(v.timestamp!).getDay() === new Date(this.location.forecast!.timestamp!).getDay())
                                      .filter((v) => new Date(v.timestamp!).getHours() === new Date(this.location.forecast!.timestamp!).getHours())[0].flow
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
                    <Line type="monotone"
                          dataKey={DATA_KEY_MEASURED}
                          stroke="green"
                          dot={false}
                          name={LINE_NAME_MEASURED}
                          activeDot={{stroke: 'green', strokeWidth: 1, r: 4}}/>
                    <CartesianGrid/>
                    <XAxis
                        type="number"
                        dataKey="datetime"
                        domain={[from, to]}
                        scale="time"
                        ticks={ticks}
                        tickFormatter={v => new Date(v).toLocaleString('de-CH', {weekday: 'short'})}
                        minTickGap={1}
                        hide={!showXAxis}/>

                    {showMinMaxReferenceLines && this.getMinMaxReferenceLines()}
                    {showTooltip && this.getTooltip()}
                    {showYAxis && this.getYAxis(this.location.minFlow!, this.location.maxFlow!)}
                    {/* payload is only necessary to get rid of unneccessary double legend entry because forecastFlow0 and forecastFlow1 are both named Min/Max */}
                    {showLegend && this.getLegend()}
                </ComposedChart>
            </ResponsiveContainer>
        </>
    }

    private getMinMaxReferenceLines() {
        return <>
            <ReferenceLine y={this.location.minFlow}>
                <Label value={this.location.minFlow} position="insideRight"/>
            </ReferenceLine>
            <ReferenceLine y={this.location.maxFlow}>
                <Label value={this.location.maxFlow} position="insideRight"/>
            </ReferenceLine>
        </>;
    }

    private getTooltip() {
        // @ts-ignore
        const MswTooltip = ({active, payload, label}) => {
            if (active && payload && payload.length) {

                let flowStr: string = "";
                let color: string = "black";
                for (let payloadItem of payload) {
                    if (payloadItem.dataKey === DATA_KEY_MEASURED) {
                        flowStr = "Measured: " + payloadItem.value;
                        color = payloadItem.stroke;
                    } else if (payloadItem.dataKey === DATA_KEY_MEDIAN) {
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

    private getYAxis(min: number, max: number) {
        return <YAxis domain={[min, max]}/>;
    }

    private getLegend() {
        return <Legend
            payload={[
                {type: "line", value: LINE_NAME_MEASURED, color: "green"},
                {type: "line", value: LINE_NAME_MEDIAN, color: "blue"},
                {type: "square", value: "25.-75. Perzentil", color: "#1e9196"},
                {type: "square", value: "Min / Max", color: "#75d4d9"},
            ]}
        />;
    }

    private normalizeGraphData(forecast: ApiForecast): NormalizedDataItem[] {
        let normalizedData: NormalizedDataItem[] = [];

        normalizedData.push(...this.normalizeGraphDataLine(forecast.measuredData!, DATA_KEY_MEASURED));
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

    private getSimpleGraphDataLine(forecastLine: ApiForecastLineEntry[]): NormalizedDataItem[] {
        return this.normalizeGraphDataLine(forecastLine, TEMPORARY_DATA_KEY_FLOW);
    }

    private normalizeGraphDataLine(forecastLine: ApiForecastLineEntry[], name: string): NormalizedDataItem[] {
        let normalizedData: any[] = [];
        for (let forecastLinePoint of forecastLine) {
            let obj: NormalizedDataItem = {datetime: new Date(forecastLinePoint.timestamp!)};
            obj[name] = forecastLinePoint.flow;
            normalizedData.push(obj);
        }
        return normalizedData;
    }

    private mergeDataLines(left: NormalizedDataItem[], right: NormalizedDataItem[], dataKey: string) {
        let output: NormalizedDataItem[] = [];

        left.forEach(leftItem => {
            let filteredRight = right.filter(rightItem => leftItem.datetime.getTime() == rightItem.datetime.getTime());
            let leftItemIsContainedInRightList: boolean = filteredRight.length > 0;
            if (leftItemIsContainedInRightList) {
                leftItem[dataKey] = filteredRight[0][TEMPORARY_DATA_KEY_FLOW];
            }
            output.push(leftItem);
        });

        right.forEach(rightItem => {
            let filteredOutput = output.filter(outputItem => rightItem.datetime.getTime() == outputItem.datetime.getTime());
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
import './MswForecastGraph.scss'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ReferenceLine,
  Label, ReferenceDot,
} from 'recharts';
import {Component} from 'react';
import {ApiForecast, ApiForecastLineEntry, ApiSpotInformation} from '../../../../gen/msw-api-ts';

interface MswForecastGraphProps {
  location: ApiSpotInformation,
  isMini: boolean,
  isMobile: boolean
}

const DATA_KEY_MEDIAN = "median";
const DATA_KEY_MEASURED = "measured";
const DATA_KEY_25_PERCENTILE = "twentyFivePercentile";
const DATA_KEY_75_PERCENTILE = "seventyFivePercentile";
const DATA_KEY_MINIMUM = "minimum";
const DATA_KEY_MAXIMUM = "maximum";

const LINE_NAME_MEASURED = "Gemessen";
let LINE_NAME_MEDIAN = "Median";
const LINE_NAME_25_PERCENTILE = "25. Perzentil";
const LINE_NAME_75_PERCENTILE = "75. Perzentil";
const LINE_NAME_MAX = "Maximum";
const LINE_NAME_MIN = "Minimum";

type NormalizedDataItem = { datetime: Date, [lineName: string]: unknown; };

export class MswForecastGraph extends Component<MswForecastGraphProps> {

  private readonly location: ApiSpotInformation;
  private readonly isMini: boolean;
  private readonly isMobile: boolean;

  constructor(props: MswForecastGraphProps) {
    super(props);
    this.location = props.location;
    this.isMini = props.isMini;
    this.isMobile = props.isMobile;
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
      firstDayMidnightDate.setHours(24, 0, 0, 0)
    ]

    let showXAxis = true;
    let showMinMaxReferenceLines = true;
    let showTooltip = true;
    let showYAxis = true;
    let showLegend = true;


    if (this.isMobile) {
      showYAxis = false;
      showLegend = false;
    } else if (this.isMini) {
      showXAxis = false;
      showMinMaxReferenceLines = false;
      showTooltip = false;
      showYAxis = false;
      showLegend = false;
    }

    return <>
      <ResponsiveContainer className="forecastGraph" width="100%" aspect={2}>
        <LineChart data={normalizedGraphData}>
          <ReferenceArea y1={this.location.minFlow}
                         y2={this.location.maxFlow}
                         ifOverflow="extendDomain"
                         fill="green"/>
          <ReferenceLine x={Date.now()} stroke="#f62e03"/>
          <ReferenceDot x={new Date(this.location.forecast!.timestamp!).getTime()}
                        y={this.location.forecast.median!
                          .filter((v) => new Date(v.timestamp!).getMonth() === new Date(this.location.forecast!.timestamp!).getMonth())
                          .filter((v) => new Date(v.timestamp!).getDay() === new Date(this.location.forecast!.timestamp!).getDay())
                          .filter((v) => new Date(v.timestamp!).getHours() === new Date(this.location.forecast!.timestamp!).getHours())
                              [0].flow
                        }
                        stroke="gold"
                        r={6}
          />
          <Line type="monotone"
                dataKey={DATA_KEY_25_PERCENTILE}
                stroke="orange"
                dot={false}
                name={LINE_NAME_25_PERCENTILE}/>
          <Line type="monotone"
                dataKey={DATA_KEY_75_PERCENTILE}
                stroke="orange"
                dot={false}
                name={LINE_NAME_75_PERCENTILE}/>
          <Line type="monotone"
                dataKey={DATA_KEY_MEDIAN}
                stroke="blue"
                dot={false}
                name={LINE_NAME_MEDIAN}
                activeDot={{ stroke: 'blue', strokeWidth: 1, r: 4 }}/>
          <Line type="monotone"
                dataKey={DATA_KEY_MEASURED}
                stroke="green"
                dot={false}
                name={LINE_NAME_MEASURED}/>
          <Line type="monotone"
                dataKey={DATA_KEY_MINIMUM}
                stroke="pink"
                dot={false}
                name={LINE_NAME_MIN}/>
          <Line type="monotone"
                dataKey={DATA_KEY_MAXIMUM}
                stroke="pink"
                dot={false}
                name={LINE_NAME_MAX}/>
          <CartesianGrid/>
          <XAxis
            type="number"
            dataKey="datetime"
            domain={[from, to]}
            scale="time"
            ticks={ticks}
            tickFormatter={v => new Date(v).getDate() + "."}
            minTickGap={1}
            hide={!showXAxis}/>

          {showMinMaxReferenceLines && this.getMinMaxReferenceLines()}
          {showTooltip && this.getTooltip()}
          {showYAxis && this.getYAxis()}
          {/* payload is only necessary to get rid of unneccessary double legend entry because forecastFlow0 and forecastFlow1 are both named Min/Max */}
          {showLegend && this.getLegend()}
        </LineChart>
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
    return <Tooltip labelFormatter={
      v => {
        let date: Date = new Date(v);
        return date.getDate() + "." + (date.getMonth()+1) + ". " + date.getHours() + ":00";
      }
    }/>;
  }

  private getYAxis() {
    return <YAxis/>;
  }

  private getLegend() {
    return <Legend
      payload={[
        {type: "line", value: LINE_NAME_MEASURED, color: "green"},
        {type: "line", value: LINE_NAME_MEDIAN, color: "blue"},
        {type: "line", value: "25.-75. Perzentil", color: "orange"},
        {type: "line", value: "Min / Max", color: "pink"},
      ]}
    />;
  }

  private normalizeGraphData(forecast: ApiForecast): NormalizedDataItem[] {
    let normalizedData: NormalizedDataItem[] = [];

    normalizedData.push(...this.normalizeGraphDataLine(forecast.measuredData!, DATA_KEY_MEASURED));
    normalizedData.push(...this.normalizeGraphDataLine(forecast.median!, DATA_KEY_MEDIAN));
    normalizedData.push(...this.normalizeGraphDataLine(forecast.twentyFivePercentile!, DATA_KEY_25_PERCENTILE));
    normalizedData.push(...this.normalizeGraphDataLine(forecast.seventyFivePercentile!, DATA_KEY_75_PERCENTILE));
    normalizedData.push(...this.normalizeGraphDataLine(forecast.min!, DATA_KEY_MINIMUM));
    normalizedData.push(...this.normalizeGraphDataLine(forecast.max!, DATA_KEY_MAXIMUM));
    return normalizedData;
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
}
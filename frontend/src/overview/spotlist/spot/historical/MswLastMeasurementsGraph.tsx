import './MswLastMeasurementsGraph.scss'
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
  Label,
} from 'recharts';
import {Component} from 'react';
import {ApiSample, ApiSpotInformation, SampleApi} from '../../../../gen/msw-api-ts';

interface MswLastMeasurementsGraphProps {
  location: ApiSpotInformation,
  isMini: boolean
}

interface MswLastMeasurementsState {
  samples: ApiSample[]
}

const DATA_KEY_MEASURED = "measured";

const LINE_NAME_MEASURED = "Gemessen";

type NormalizedDataItem = { datetime: Date, [lineName: string]: unknown; };

export class MswLastMeasurementsGraph extends Component<MswLastMeasurementsGraphProps> {

  private readonly location: ApiSpotInformation;
  private readonly isMini: boolean;

  state: MswLastMeasurementsState = {
    samples: [],
  };

  constructor(props: MswLastMeasurementsGraphProps) {
    super(props);
    this.location = props.location;
    this.isMini = props.isMini;
    new SampleApi().getLast40DaysSamples({stationId: this.location.stationId!}).subscribe(res => {
      if(res) {
        this.setState({samples: res});
      }
    });
  }
  
  render() {
    if (this.state.samples.length == 0) {
      return <>
        <div>Detailed Graph not possible at the moment...</div>
      </>
    }

    let normalizedGraphData: any[] = this.normalizeGraphDataLine(this.state.samples, DATA_KEY_MEASURED);

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

    const ticks = this.getTicks();

    const from = ticks[0];
    const to = ticks[ticks.length - 1];

    return <>
      <ResponsiveContainer className="graph" width="100%" aspect={2}>
        <LineChart data={normalizedGraphData}>
          <ReferenceArea y1={this.location.minFlow}
                         y2={this.location.maxFlow}
                         ifOverflow="extendDomain"
                         fill="green"/>
          <ReferenceLine x={Date.now()} stroke="#666666"/>
          <Line type="monotone"
                dataKey={DATA_KEY_MEASURED}
                stroke="green"
                dot={false}
                name={LINE_NAME_MEASURED}
                activeDot={{ stroke: 'green', strokeWidth: 1, r: 4 }}/>
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
          {showYAxis && this.getYAxis(this.location.minFlow!, this.location.maxFlow!)}
          {showLegend && this.getLegend()}
        </LineChart>
      </ResponsiveContainer>
    </>
  }

  private getTicks() {
    let nrOfTicks = 10;
    let nrOfDays = 50;

    let oneDay = 24 * 60 * 60 * 1000;

    let ticks: number[] = [];
    for(let i = 0; i < nrOfTicks; i++) {
      ticks[i] = Date.now() - oneDay * (i-1)*(nrOfDays/nrOfTicks);
    }

    return ticks;
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
    const MswTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {

        let flowStr: string = "";
        let color: string = "black";
        for(let payloadItem of payload) {
          if (payloadItem.dataKey === DATA_KEY_MEASURED) {
            flowStr = "Measured: " + payloadItem.value;
            color = payloadItem.stroke;
          }
        }

        return (
          <div className="tooltip">
            <p className="tooltip_timestamp">{label.getDate() + "." + (label.getMonth()+1) + ". " + label.getHours() + ":00"}</p>
            <p className="tooltip_value" style={{ color: color }}>{flowStr}</p>
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
        {type: "line", value: LINE_NAME_MEASURED, color: "green"}
      ]}
    />;
  }

  private normalizeGraphDataLine(line: ApiSample[], name: string): NormalizedDataItem[] {
    let normalizedData: any[] = [];
    for (let linePoint of line) {
      let obj: NormalizedDataItem = {datetime: new Date(linePoint.timestamp!)};
      obj[name] = linePoint.flow;
      normalizedData.push(obj);
    }
    return normalizedData;
  }
}
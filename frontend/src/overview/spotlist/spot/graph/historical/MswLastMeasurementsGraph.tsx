import './MswLastMeasurementsGraph.scss'
import {
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    ReferenceArea,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {useState} from 'react';
import {ApiSample, ApiSpotInformation, SampleApi} from '../../../../../gen/msw-api-ts';
import {authConfiguration} from '../../../../../api/config/AuthConfiguration';
import {AxiosResponse} from 'axios';
import {useUserAuth} from '../../../../../user/UserAuthContext';
import {MswGraphProps} from "../forecast/MswForecastGraph";

interface MswLastMeasurementsState {
    samples: ApiSample[]
}

const DATA_KEY_MEASURED = "measured";

const LINE_NAME_MEASURED = "Gemessen";

type NormalizedDataItem = { datetime: Date, [lineName: string]: unknown; };

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
            <LineChart data={normalizedGraphData}>
                <ReferenceArea y1={location.minFlow}
                               y2={location.maxFlow}
                               ifOverflow="extendDomain"
                               fill="green"/>
                <ReferenceLine x={Date.now()} stroke="#666666"/>
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
                    tickFormatter={v => new Date(v).getDate() + "."}
                    minTickGap={1}
                    hide={!withXAxis}/>

                {withMinMaxReferenceLines && getMinMaxReferenceLines()}
                {withTooltip && getTooltip()}
                {withYAxis && getYAxis(location.minFlow!, location.maxFlow!)}
                {withLegend && getLegend()}
            </LineChart>
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

    function getMinMaxReferenceLines() {
        return <>
            <ReferenceLine y={location.minFlow}>
                <Label value={location.minFlow} position="insideRight"/>
            </ReferenceLine>
            <ReferenceLine y={location.maxFlow}>
                <Label value={location.maxFlow} position="insideRight"/>
            </ReferenceLine>
        </>;
    }

    function getTooltip() {
        // @ts-ignore
        const MswTooltip = ({active, payload, label}) => {
            if (active && payload && payload.length) {

                let flowStr: string = "";
                let color: string = "black";
                for (let payloadItem of payload) {
                    if (payloadItem.dataKey === DATA_KEY_MEASURED) {
                        flowStr = "Measured: " + payloadItem.value;
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

    function getYAxis(min: number, max: number) {
        return <YAxis domain={[min, max]}/>;
    }

    function getLegend() {
        return <Legend
            payload={[
                {type: "line", value: LINE_NAME_MEASURED, color: "green"},
            ]}
        />;
    }

    function normalizeGraphDataLine(line: ApiSample[], name: string): NormalizedDataItem[] {
        let normalizedData: any[] = [];
        for (let linePoint of line) {
            let obj: NormalizedDataItem = {datetime: new Date(linePoint.timestamp!)};
            obj[name] = linePoint.flow;
            normalizedData.push(obj);
        }
        return normalizedData;
    }
}
import '../base-graph/MswGraph.scss'
import {
    commonPlotlyConfig,
    createTrace,
    getAspectRatio,
    getCommonPlotlyLayout,
    getTimestamps,
    MswGraphProps,
    ONE_WEEK,
    plotColors
} from "../base-graph/MswGraph";
import {MswLoader} from "../../../../../loader/MswLoader";
import Plot from 'react-plotly.js';

export const MswLastMeasurementsGraph = (props: MswGraphProps) => {
    if (props.spot.last40DaysLoaded) {
        if (!props.spot.last40Days || props.spot.last40Days.length === 0) {
            return <div>Detailed Graph not possible at the moment...</div>
        }
    } else {
        return <MswLoader/>
    }

    // Process data
    const processedData = {
        measured: (() => {
            if (!props.spot.last40Days?.length) return [];

            const hourlyAverages = props.spot.last40Days.reduce<Record<string, {
                sum: number,
                count: number
            }>>((acc, sample) => {
                const hourKey = sample.timestamp.slice(0, 13); // Get YYYY-MM-DDTHH

                if (!acc[hourKey]) {
                    acc[hourKey] = {sum: 0, count: 0};
                }
                acc[hourKey].sum += sample.flow;
                acc[hourKey].count++;

                return acc;
            }, {});

            // Calculate hourly averages and maintain chronological order
            return Object.entries(hourlyAverages)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([hourKey, {sum, count}]) => ({
                    timestamp: hourKey + ':00:00.000Z', // Store in UTC
                    flow: Math.round((sum / count) * 10) / 10 // Round to 1 decimal
                }));
        })(),
        max: [] // Empty array for max values since we don't have them for historical data
    };

    // Calculate weekly ticks for x-axis
    const now = new Date();
    const sixWeeksAgo = new Date(now.getTime() - (6 * ONE_WEEK));
    const weeklyTicks = [];
    const weeklyLabels = [];

    for (let date = new Date(now); date >= sixWeeksAgo; date = new Date(date.getTime() - ONE_WEEK)) {
        weeklyTicks.push(date.getTime());
        weeklyLabels.push(
            `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`
        );
    }

    // Get common layout and extend it with last measurements specific settings
    const layout = {
        ...getCommonPlotlyLayout(
            props.isMini,
            getTimestamps(processedData.measured),
            props.spot.minFlow,
            props.spot.maxFlow,
            false),
        xaxis: {
            ...getCommonPlotlyLayout(props.isMini, getTimestamps(processedData.measured)).xaxis,
            tickvals: weeklyTicks as any[],
            ticktext: weeklyLabels,
        }
    };

    return (
        <Plot
            data={[
                createTrace(
                    processedData.measured,
                    props.isMini,
                    plotColors.measured,
                    'Measured')
            ]}
            layout={layout}
            style={{width: '100%', aspectRatio: getAspectRatio(props.isMini)}}
            useResizeHandler={true}
            config={{...commonPlotlyConfig, staticPlot: props.isMini}}
        />
    );
};

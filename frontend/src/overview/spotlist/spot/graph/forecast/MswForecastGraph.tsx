import '../base-graph/MswGraph.scss'
import Plot from 'react-plotly.js';
import {ApiLineEntry} from '../../../../../gen/msw-api-ts';
import {
    commonPlotlyConfig,
    createAreaTrace,
    createTrace,
    getAspectRatio,
    getCommonPlotlyLayout,
    getTimestamps,
    MswGraphProps,
    plotColors
} from "../base-graph/MswGraph";
import {MswLoader} from "../../../../../loader/MswLoader";

export const MswForecastGraph = (props: MswGraphProps) => {
    if (!props.spot.forecastLoaded) {
        return <MswLoader/>;
    }
    if (!props.spot.forecast) {
        return <div>Detailed Forecast not possible at the moment...</div>;
    }

    // Get data for plotting
    const {currentSample} = props.spot ?? {};
    const {minFlow, maxFlow} = props.spot ?? {};
    const {measuredData, median, twentyFivePercentile, seventyFivePercentile, max, min} = props.spot.forecast;

    // Get timestamps for x-axis grid and labels
    const allTimestamps = getTimestamps([...measuredData, ...median]);

    // Update all series with current measurement if available
    const updateWithCurrentSample = (series: ApiLineEntry[]) => {
        if (!currentSample) return series;

        const currentTime = currentSample.timestamp;
        return [
            {timestamp: currentTime, flow: currentSample.flow},
            ...series.filter(item => item.timestamp > currentTime)
        ];
    };

    // Process all data series
    const processedData = {
        measured: currentSample
            ? [...measuredData, {timestamp: currentSample.timestamp, flow: currentSample.flow}]
            : measuredData,
        median: updateWithCurrentSample(median),
        min: updateWithCurrentSample(min),
        max: updateWithCurrentSample(max),
        p25: updateWithCurrentSample(twentyFivePercentile),
        p75: updateWithCurrentSample(seventyFivePercentile)
    };


    // Get common layout and extend it with forecast-specific settings
    const layout = {
        ...getCommonPlotlyLayout(props.isMini, allTimestamps, minFlow, maxFlow),
        xaxis: {
            ...getCommonPlotlyLayout(props.isMini, allTimestamps).xaxis,
            // Only show labels at noon
            tickvals: allTimestamps.filter(timestamp => new Date(timestamp).getHours() === 12),
            // Format labels as DD.MM
            ticktext: allTimestamps
                .filter(timestamp => new Date(timestamp).getHours() === 12)
                .map(timestamp => {
                    const date = new Date(timestamp);
                    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                }),
        },
        shapes: [
            ...(getCommonPlotlyLayout(props.isMini, allTimestamps, minFlow, maxFlow).shapes || []),
            // Vertical lines at midnight (darker than noon grid)
            ...(allTimestamps.length > 0 ?
                    allTimestamps
                        .filter(timestamp => new Date(timestamp).getHours() === 0)
                        .map(timestamp => ({
                            type: 'line' as const,
                            x0: timestamp,
                            x1: timestamp,
                            y0: 0,
                            y1: 1,
                            yref: 'paper' as const,
                            line: {
                                color: 'rgba(169, 169, 169, 0.8)',  // Dark gray for midnight lines
                                width: 1
                            },
                            layer: 'below' as const
                        }))
                    : []
            ),
        ]
    };


    return (
        <Plot
            data={[
                // Bottom layer: Min-max range
                ...createAreaTrace(
                    processedData.max,
                    processedData.min,
                    'Min-Max',
                    plotColors.minMaxRange.fill,
                    props.isMini),

                // Middle layer: 25-75 percentile range
                ...createAreaTrace(
                    processedData.p75,
                    processedData.p25,
                    '25-75%',
                    plotColors.percentileRange.fill,
                    props.isMini
                ),

                // Top layers: Forecast median and measured data
                createTrace(
                    processedData.median,
                    props.isMini,
                    plotColors.median,
                    'Median',
                ),
                createTrace(
                    processedData.measured,
                    props.isMini,
                    plotColors.measured,
                    'Measured',
                )
            ]}
            layout={layout}
            style={{
                width: '100%',
                aspectRatio: getAspectRatio(props.isMini)
            }}
            useResizeHandler={true}
            config={{
                ...commonPlotlyConfig,
                staticPlot: props.isMini
            }}
        />
    );
};

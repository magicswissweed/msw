import '../base-graph/MswGraph.scss'
import Plot from 'react-plotly.js';
import {ApiLineEntry} from '../../../../../gen/msw-api-ts';
import {
    commonPlotlyConfig,
    convertToUTC,
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
    const allTimestamps = Array.from([...getTimestamps(measuredData), ...getTimestamps(median)]).sort();

    // Update all series with current measurement if available
    const updateWithCurrentSample = (series: ApiLineEntry[]) => {
        if (!currentSample) return series;

        const currentUTC = convertToUTC(new Date(currentSample.timestamp));
        return [
            {timestamp: currentUTC, flow: currentSample.flow},
            ...series.filter(item => convertToUTC(new Date(item.timestamp)) > currentUTC)
        ];
    };

    // Process all data series
    const processedData = {
        measured: currentSample
            ? [...measuredData, {timestamp: convertToUTC(new Date(currentSample.timestamp)), flow: currentSample.flow}]
            : measuredData,
        median: updateWithCurrentSample(median),
        min: updateWithCurrentSample(min),
        max: updateWithCurrentSample(max),
        p25: updateWithCurrentSample(twentyFivePercentile),
        p75: updateWithCurrentSample(seventyFivePercentile)
    };


    // Get common layout and extend it with forecast-specific settings
    const layout = {
        ...getCommonPlotlyLayout({
            isMini: props.isMini,
            allTimestamps,
            minFlow,
            maxFlow,
        }),
        xaxis: {
            ...getCommonPlotlyLayout({isMini: props.isMini, allTimestamps}).xaxis,
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
            ...(getCommonPlotlyLayout({isMini: props.isMini, minFlow, maxFlow, allTimestamps}).shapes || []),
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
                ...createAreaTrace({
                    upperData: processedData.max,
                    lowerData: processedData.min,
                    name: 'Min-Max',
                    fillcolor: plotColors.minMaxRange.fill,
                    showLegend: !props.isMini,
                    isMini: props.isMini
                }),


                // Middle layer: 25-75 percentile range
                ...createAreaTrace({
                    upperData: processedData.p75,
                    lowerData: processedData.p25,
                    name: '25-75%',
                    fillcolor: plotColors.percentileRange.fill,
                    showLegend: !props.isMini,
                    isMini: props.isMini
                }),

                // Top layers: Forecast median and measured data
                createTrace({
                    data: processedData.median,
                    name: 'Median',
                    color: plotColors.median,
                    lineWidth: props.isMini ? 1 : 2,
                    showLegend: !props.isMini,
                    skipHover: props.isMini,
                }),
                createTrace({
                    data: processedData.measured,
                    name: 'Measured',
                    color: plotColors.measured,
                    lineWidth: props.isMini ? 1 : 2,
                    showLegend: !props.isMini,
                    skipHover: props.isMini
                })
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

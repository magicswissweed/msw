import '../base-graph/MswGraph.scss'
import {
    calculateMaxY,
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
import Plot from 'react-plotly.js';

export const MswHistoricalYearsGraph = (props: MswGraphProps) => {
    if (!props.spot.historical) {
        return (
            <div>Detailed Graph not possible at the moment...</div>
        );
    }

    // no data processing needed for this graph
    const processedData = {
        measured: props.spot.historical.currentYear,
        median: props.spot.historical.median,
        min: props.spot.historical.min,
        max: props.spot.historical.max,
        p25: props.spot.historical.twentyFivePercentile,
        p75: props.spot.historical.seventyFivePercentile
    };

    // Get timestamps for x-axis grid and labels
    const allTimestamps = Array.from([...getTimestamps(processedData.median)]).sort();

    // Calculate y-axis maximum with 10% padding
    const maxY = calculateMaxY(processedData.measured || [], processedData.max || [], 10);

    const layout = {
        ...getCommonPlotlyLayout({
            isMini: props.isMini,
            allTimestamps,
            minFlow: props.spot.minFlow,
            maxFlow: props.spot.maxFlow,
        }),
        xaxis: {
            ...getCommonPlotlyLayout({isMini: props.isMini}).xaxis,
            // Show month labels in the middle of each month
            tickvals: Array.from({length: 12}, (_, i) => {
                const date = new Date();
                date.setMonth(i);
                date.setDate(15); // Middle of month
                date.setHours(12, 0, 0, 0);
                return convertToUTC(date);
            }),
            // Format labels as month abbreviations
            ticktext: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        },
        yaxis: {
            ...getCommonPlotlyLayout({isMini: props.isMini}).yaxis,
            // Force graph to show x-axis by setting explicit range from zero
            range: [0, maxY],
        },
        shapes: [
            ...(getCommonPlotlyLayout({
                isMini: props.isMini,
                minFlow: props.spot.minFlow,
                maxFlow: props.spot.maxFlow,
                allTimestamps
            }).shapes || []),
            // Vertical lines at month boundaries (1st of each month)
            ...Array.from({length: 11}, (_, i) => {
                const date = new Date();
                date.setMonth(i + 1);
                date.setDate(1);
                date.setHours(0, 0, 0, 0);
                return convertToUTC(date);
            }).map(timestamp => ({
                type: 'line' as const,
                x0: timestamp,
                x1: timestamp,
                y0: 0,
                y1: 1,
                yref: 'paper' as const,
                line: {
                    color: 'rgba(169, 169, 169, 0.8)', // Dark gray for month lines
                    width: 1
                },
                layer: 'below' as const
            }))
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

                // Top layers: Historical median and measured data
                createTrace({
                    data: processedData.median,
                    name: 'Median',
                    color: plotColors.median,
                    isMini: props.isMini
                }),
                createTrace({
                    data: processedData.measured,
                    name: 'Measured',
                    color: plotColors.measured,
                    isMini: props.isMini
                })
            ]}
            layout={layout}
            style={{
                width: '100%',
                aspectRatio: getAspectRatio(props.isMini)
            }}
            useResizeHandler={true}
            config={{...commonPlotlyConfig, staticPlot: props.isMini}}
        />
    );
};


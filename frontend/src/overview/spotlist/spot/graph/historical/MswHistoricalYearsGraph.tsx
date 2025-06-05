import '../base-graph/MswGraph.scss'
import {
    MswGraphProps,
    getTimestamps,
    createTrace,
    plotColors,
    calculateMaxY,
    defaultGraphProps,
    getCommonPlotlyLayout,
    commonPlotlyConfig
} from "../base-graph/MswGraph";
import Plot from 'react-plotly.js';

export const MswHistoricalYearsGraph = ({
    spot,
    isMini = defaultGraphProps.isMini,
    showLegend = defaultGraphProps.showLegend,
    aspectRatio = defaultGraphProps.aspectRatio,
}: MswGraphProps) => {
    if (!spot.historical) {
        return (
            <div>Detailed Graph not possible at the moment...</div>
        );
    }

    // Get data for plotting
    const { minFlow, maxFlow } = spot ?? {};
    const { currentYear, median, twentyFivePercentile, seventyFivePercentile, max, min } = spot.historical!;

    const processedData = {
        measured: currentYear,
        median: median,
        min: max,
        max: min,
        p25: twentyFivePercentile,
        p75: seventyFivePercentile
    };
    
    // Get timestamps for x-axis grid and labels
    const allTimestamps = Array.from(new Set([
        ...getTimestamps(processedData.median),
    ])).sort();

    // Calculate y-axis maximum with 10% padding
    const maxY = calculateMaxY([processedData.measured || [], processedData.max || []], undefined, 0);

    // Add some days of padding to the x-axis depending on screen size (!showLegend -> mobile)
    const dataPadding = showLegend ? 7 * 24 * 60 * 60 * 1000 : 0;

    const layout = {
        ...getCommonPlotlyLayout({ 
            isMini, 
            allTimestamps, 
            minFlow, 
            maxFlow, 
            showLegend,
        }),
        xaxis: {
            ...getCommonPlotlyLayout({ isMini }).xaxis,
            // Show month labels in the middle of each month
            tickvals: Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(i);
                date.setDate(15); // Middle of month
                date.setHours(12, 0, 0, 0);
                return date.toISOString();
            }),
            // Format labels as month abbreviations
            ticktext: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            // range needs 7 days of padding to show Jan label
            range: allTimestamps.length ? [
                new Date(new Date(allTimestamps[0]).getTime() - dataPadding).toISOString(),
                new Date(new Date(allTimestamps[allTimestamps.length - 1]).getTime() + dataPadding).toISOString()
            ] : undefined,
        },
        yaxis: {
            ...getCommonPlotlyLayout({ isMini }).yaxis,
            range: [0, maxY],
            ticklabelposition: (showLegend ? 'inside' : 'outside') as ('inside' | 'outside'),
        },
        margin: isMini ? {
            l: 0,
            r: 0,
            t: 0,
            b: 0
        } : {
            l: showLegend ? 30 : 60,
            r: 30,
            t: 0,
            b: showLegend ? 0 : 30 // provide space for x-axis labels
        },
        shapes: [
          ...(getCommonPlotlyLayout({ isMini, minFlow, maxFlow, allTimestamps }).shapes || []),
          // Vertical lines at month boundaries (1st of each month)
          ...Array.from({ length: 11 }, (_, i) => {
            const date = new Date();
            date.setMonth(i + 1);
            date.setDate(1);
            date.setHours(0, 0, 0, 0);
            return date.toISOString();
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
                createTrace(processedData.max, { 
                    color: 'transparent',
                    showLegend: false,
                    skipHover: true
                }),
                createTrace(processedData.min, {
                    name: 'Min-Max',
                    color: 'transparent',
                    fill: 'tonexty',
                    fillcolor: plotColors.minMaxRange.fill,
                    skipHover: true,
                    showLegend: !isMini && showLegend
                }),
                // Middle layer: 25-75 percentile range
                createTrace(processedData.p75, {
                    color: 'transparent',
                    showLegend: false,
                    skipHover: true
                }),
                createTrace(processedData.p25, {
                    name: '25-75%',
                    color: 'transparent',
                    fill: 'tonexty',
                    fillcolor: plotColors.percentileRange.fill,
                    skipHover: true,
                    showLegend: !isMini && showLegend
                }),
                // Top layers: Forecast median and measured data
                createTrace(processedData.median, {
                    name: 'Median',
                    color: plotColors.median,
                    lineWidth: isMini || !showLegend ? 1 : 2,
                    showLegend: !isMini && showLegend,
                    skipHover: isMini
                }),
                createTrace(processedData.measured, {
                    name: 'Measured',
                    color: plotColors.measured,
                    lineWidth: isMini || !showLegend ? 1 : 2,
                    showLegend: !isMini && showLegend,
                    skipHover: isMini
                })
            ]}
            layout={layout}
            style={{ 
                width: '100%',
                aspectRatio: aspectRatio
            }}
            useResizeHandler={true}
            config={{
                ...commonPlotlyConfig,
                staticPlot: isMini
            }}
        />
    );
};

    
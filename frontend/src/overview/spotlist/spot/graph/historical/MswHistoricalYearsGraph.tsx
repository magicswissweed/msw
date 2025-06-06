import '../base-graph/MswGraph.scss'
import {
    MswGraphProps,
    getTimestamps,
    createTrace,
    plotColors,
    calculateMaxY,
    defaultGraphProps,
    getCommonPlotlyLayout,
    commonPlotlyConfig,
    createAreaTrace
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

    // no data processing needed for this graph
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

        },
        yaxis: {
            ...getCommonPlotlyLayout({ isMini }).yaxis,
            // Force graph to show x-axis
            range: [0, maxY],
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

              ...createAreaTrace({
                upperData: processedData.max,
                lowerData: processedData.min, 
                name: 'Min-Max',
                fillcolor: plotColors.minMaxRange.fill,
                showLegend: !isMini && showLegend,
                isMini: isMini
              }),
                    
                // Middle layer: 25-75 percentile range
                ...createAreaTrace({
                    upperData: processedData.p75,
                    lowerData: processedData.p25,
                    name: '25-75%',
                    fillcolor: plotColors.percentileRange.fill,
                    showLegend: !isMini && showLegend,
                    isMini: isMini
                }), 
                
                // Top layers: Forecast median and measured data
                createTrace({
                    data: processedData.median,
                    name: 'Median',
                    color: plotColors.median,
                    lineWidth: isMini || !showLegend ? 1 : 2,
                    showLegend: !isMini && showLegend,
                    skipHover: isMini
                }),
                createTrace({
                    data: processedData.measured,
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

    
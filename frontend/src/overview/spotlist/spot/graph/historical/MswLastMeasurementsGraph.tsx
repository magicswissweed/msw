import '../base-graph/MswGraph.scss'
import {
    MswGraphProps,
    getTimestamps,
    createTrace,
    plotColors,
    getCommonPlotlyLayout,
    commonPlotlyConfig,
    ONE_WEEK,
    toSwissTime
} from "../base-graph/MswGraph";
import {MswLoader} from "../../../../../loader/MswLoader";
import Plot from 'react-plotly.js';

export const MswLastMeasurementsGraph = ({
    spot,
    isMini = false,
    aspectRatio = 2,
    showLegend = true
}: MswGraphProps) => {
    if (spot.last40DaysLoaded) {
        if (!spot.last40Days || spot.last40Days.length === 0) {
            return <div>Detailed Graph not possible at the moment...</div>
        }
    } else {
        return <MswLoader/>
    }

    // Get data for plotting
    const { last40Days } = spot ?? {};
    const { minFlow, maxFlow } = spot ?? {};

    // Process data
    const processedData = {
        measured: (() => {
            if (!last40Days?.length) return [];

            const hourlyAverages = last40Days.reduce<Record<string, { sum: number, count: number }>>((acc, sample) => {
                // Convert timestamp to Swiss time (UTC+2)
                const swissDate = toSwissTime(sample.timestamp);
                const hourKey = swissDate.toISOString().slice(0, 13); // Get YYYY-MM-DDTHH
                
                if (!acc[hourKey]) {
                    acc[hourKey] = { sum: 0, count: 0 };
                } 
                acc[hourKey].sum += sample.flow;
                acc[hourKey].count++;
                
                return acc;
            }, {});
            
            // Calculate hourly averages and maintain chronological order
            return Object.entries(hourlyAverages)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([hourKey, { sum, count }]) => ({
                    timestamp: hourKey + ':00:00.000Z', // Store in UTC
                    flow: Math.round((sum / count) * 10) / 10 // Round to 1 decimal
                }));
        })(),
        max: [] // Empty array for max values since we don't have them for historical data
    };

    // Get timestamps for x-axis grid and labels
    const allTimestamps = Array.from(new Set([
        ...getTimestamps(processedData.measured),
    ])).sort();

    // Calculate weekly ticks for x-axis
    const now = new Date();
    const sixWeeksAgo = new Date(now.getTime() - (6 * ONE_WEEK));
    const weeklyTicks = [];
    const weeklyLabels = [];
    
    for (let date = new Date(now); date >= sixWeeksAgo; date = new Date(date.getTime() - ONE_WEEK)) {
        const swissDate = toSwissTime(date);
        weeklyTicks.push(swissDate.toISOString());
        weeklyLabels.push(
            `${swissDate.getDate().toString().padStart(2, '0')}.${(swissDate.getMonth() + 1).toString().padStart(2, '0')}`
        );
    }

    // Get common layout and extend it with last measurements specific settings
    const layout = {
        ...getCommonPlotlyLayout({ 
            isMini, 
            allTimestamps, 
            minFlow, 
            maxFlow, 
            showCurrentTimeLine: false,
            showLegend
        }),
        xaxis: {
            ...getCommonPlotlyLayout({ isMini }).xaxis,
            tickvals: weeklyTicks as any[],
            ticktext: weeklyLabels,
            range: allTimestamps.length ? [allTimestamps[0], allTimestamps[allTimestamps.length - 1]] : undefined

        }
    };

    return (
        <Plot
            data={[
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

import '../base-graph/MswGraph.scss'
import Plot from 'react-plotly.js';
import {ApiLineEntry} from '../../../../../gen/msw-api-ts';
import {
    MswGraphProps,
    convertToUTC,
    getTimestamps,
    createTrace,
    plotColors,
    getCommonPlotlyLayout,
    commonPlotlyConfig,
    defaultGraphProps,
    createAreaTrace
} from "../base-graph/MswGraph";
import {MswLoader} from "../../../../../loader/MswLoader";

export const MswForecastGraph = ({
    spot,
    isMini = defaultGraphProps.isMini,
    showLegend = defaultGraphProps.showLegend,
    aspectRatio = defaultGraphProps.aspectRatio,
}: MswGraphProps) => {
    if (!spot.forecastLoaded) {
        return <MswLoader/>;
    }
    if (!spot.forecast) {
        return <div>Detailed Forecast not possible at the moment...</div>;
    }

    // Get data for plotting
    const { currentSample } = spot ?? {};
    const { minFlow, maxFlow } = spot ?? {};
    const { measuredData, median, twentyFivePercentile, seventyFivePercentile, max, min } = spot.forecast;

    // Get timestamps for x-axis grid and labels
    const allTimestamps = Array.from(new Set([
        ...getTimestamps(measuredData),
        ...getTimestamps(median)
    ])).sort();
    
    // Update all series with current measurement if available
    const updateWithCurrentSample = (series: ApiLineEntry[]) => {
        if (!currentSample) return series;
        
        const currentUTC = convertToUTC(currentSample.timestamp);
        return [
            { timestamp: currentUTC, flow: currentSample.flow },
            ...series.filter(item => convertToUTC(item.timestamp) > currentUTC)
        ];
    };

    // Process all data series
    const processedData = {
        measured: currentSample 
            ? [...measuredData, { timestamp: convertToUTC(currentSample.timestamp), flow: currentSample.flow }]
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
            isMini, 
            allTimestamps, 
            minFlow, 
            maxFlow, 
            showLegend,
        }),
        xaxis: {
            ...getCommonPlotlyLayout({ isMini, allTimestamps }).xaxis, 
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
            ...(getCommonPlotlyLayout({ isMini, minFlow, maxFlow, allTimestamps }).shapes || []),
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
                    skipHover: isMini,
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

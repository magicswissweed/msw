import '../base-graph/MswGraph.scss'
import {
    MswGraphProps,
    getTimestamps,
    createTrace,
    plotColors,
    calculateMaxY,
    defaultGraphProps
} from "../base-graph/MswGraph";
import Plot from 'react-plotly.js';

export const MswHistoricalYearsGraph = ({
    spot,
    isMini = defaultGraphProps.isMini,
    showLegend = defaultGraphProps.showLegend,
    aspectRatio = defaultGraphProps.aspectRatio,
}: MswGraphProps) => {

        if (!spot.historical) {
            return <>
                <div>Detailed Graph not possible at the moment...</div>
            </>
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
        const dataPadding = showLegend ? 7*24*60*60*1000 : 0*24*60*60*1000;

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
              layout={{
                  // autosize: true,
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  xaxis: {
                      // title: { text: '' },
                      // tickformat: '%d.%m',
                      // type: 'date',
                      // fixedrange: true,
                      // dtick: 12 * 60 * 60 * 1000,  // Show grid every 12 hours
                      // showgrid: true,
                      gridcolor: 'transparent',  // Light gray for noon grid
                      // gridwidth: 1,
                      // tickmode: 'array',
                      // showticklabels: !isMini,
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
                      ] : undefined
                  },
                  yaxis: {
                      fixedrange: true,
                      showticklabels: !isMini,
                      gridcolor: isMini? 'transparent' : 'rgba(211, 211, 211, 0.5)',  
                      ticklabelposition: showLegend ? 'inside' : 'outside',
                      // TODO: decide on design preference
                      range: [0, maxY], // Start at 0, use calculated maximum value
                      // scaleanchor: aspectRatio ? 'x' : undefined,
                      // scaleratio: aspectRatio
                  },
                  legend: !isMini && showLegend ? {
                      orientation: 'h',
                      y: -0.1,
                      yanchor: 'top',
                      xanchor: 'center',
                      x: 0.5,
                      itemclick: false,
                      itemdoubleclick: false
                  } : undefined,
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
                      // Vertical line showing current time
                      {
                          type: 'line' as const,
                          x0: new Date().toISOString(),
                          x1: new Date().toISOString(),
                          y0: 0,
                          y1: 1,
                          yref: 'paper' as const,
                          line: {
                              color: plotColors.currentTime.line,
                              width: 2,
                              dash: 'dash' as const
                          }
                      },
          
                      // Horizontal band for acceptable flow range
                      ...(minFlow !== undefined && maxFlow !== undefined ? [{
                          type: 'rect' as const,
                          x0: allTimestamps[0],
                          x1: allTimestamps[allTimestamps.length - 1],
                          y0: minFlow,
                          y1: maxFlow,
                          fillcolor: plotColors.acceptableRange.fill,
                          line: { width: 0 },
                          layer: 'below' as const
                      }] : []),
          
                      // Vertical lines at month boundaries (1st of each month)
                      ...Array.from({ length: 11 }, (_, i) => {
                          const date = new Date();
                          date.setMonth(i+1);
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
                              color: 'rgba(169, 169, 169, 0.8)',  // Dark gray for month lines
                              width: 1
                          },
                          layer: 'below' as const
                      }))
                  ],
                  hoverlabel: isMini ? undefined : {
                      bgcolor: 'white',
                      bordercolor: 'gray',
                      font: { size: 13 }
                  },
                  hovermode: isMini ? false : 'closest',
                  dragmode: false
              }}
              style={{ 
                width: '100%',
                aspectRatio: 2
              }}
              useResizeHandler={true}
              config={{
                  responsive: true,
                  displayModeBar: false,
                  scrollZoom: false,
                  doubleClick: false,
                  modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
                  staticPlot: isMini
              }}  
            />
        );
    };

    
import {ApiFlowSample} from "../../../../../gen/msw-api-ts";
import {SpotModel} from "../../../../../model/SpotModel";
import {Layout, Config } from 'plotly.js';

export const DATA_KEY_MEDIAN = "median";
export let LINE_NAME_MEDIAN = "median";

export const DATA_KEY_MEASURED = "measured";
export const LINE_NAME_MEASURED = "measured";

export interface MswGraphProps {
    spot: SpotModel,
    isMini?: boolean | undefined;
    showLegend?: boolean;
    aspectRatio?: number;
}

// Default values for graph props
export const defaultGraphProps = {
    isMini: false,
    showLegend: true,
    aspectRatio: 2,
} as const;

// Color configuration for the plots
export const plotColors = {
    measured: 'rgb(15, 125, 72)',      // Green for actual measurements
    median: 'rgb(59, 96, 232)',        // Blue for median forecast
    percentileRange: {
        line: 'gray',
        fill: 'rgba(30, 144, 150, 0.7)'  // Darker blue for 25-75 percentile range
    },
    minMaxRange: {
        line: 'gray',
        fill: 'rgba(117, 212, 217, 0.7)' // Lighter blue for min-max range
    },
    currentTime: {
        line: 'gray'
    },
    acceptableRange: {
        fill: 'rgba(7, 169, 37, 0.5)'    // Transparent green for acceptable range
    }
};

// Convert local timestamp to UTC format for consistency
export function convertToUTC(timestamp: string): string {
    return new Date(timestamp).toISOString();
}

// Extract timestamps and flows from a data series
export function getTimestamps(data: ApiFlowSample[]): string[] {
    return data.map(item => convertToUTC(item.timestamp));
}

export function getFlows(data: ApiFlowSample[]): number[] {
    return data.map(item => item.flow);
}

// Create a trace for Plotly with common defaults
export function createTrace(data: ApiFlowSample[], options: {
    name?: string,
    color?: string,
    fill?: 'none' | 'tozeroy' | 'tozerox' | 'tonexty' | 'tonextx' | 'toself' | 'tonext',
    fillcolor?: string,
    showLegend?: boolean,
    skipHover?: boolean,
    lineWidth?: number
}) {
    return {
        x: getTimestamps(data),
        y: getFlows(data),
        type: 'scatter' as const,
        mode: 'lines' as const,
        line: { 
            width: options.lineWidth ?? (options.fill ? 0 : 1),
            shape: 'spline' as const,
            color: options.color
        },
        fill: options.fill,
        name: options.name,
        showlegend: options.showLegend ?? true,
        hoverinfo: options.skipHover ? 'skip' as const : 'all' as const,
        hovertemplate: options.skipHover ? undefined : '%{x|%d.%m.%Y %H:%M}<br>Flow: %{y:.1f}<extra></extra>',
        fillcolor: options.fillcolor ?? (options.fill ? options.color : undefined)
    };
}

// Calculate maximum Y value from data series with padding
export function calculateMaxY(data: ApiFlowSample[][], currentSample?: ApiFlowSample | null, paddingPercent: number = 10): number {
    const getMaxValue = (data: ApiFlowSample[]) => data.length > 0 ? Math.max(...data.map(d => d.flow)) : 0;
    
    const maxY = Math.max(
        ...data.map(series => getMaxValue(series)),
        currentSample?.flow || 0
    );
    
    return maxY * (1 + paddingPercent/100); // Add padding percentage
}

// Helper function to check if a timestamp is the start of a month
export function isStartOfMonth(timestamp: string): boolean {
    const date = new Date(timestamp);
    return date.getUTCDate() === 1 && date.getUTCHours() === 0;
}

// Common time constants
export const SWISS_TIMEZONE_OFFSET = 2 * 60 * 60 * 1000; // UTC+2 in milliseconds
export const ONE_HOUR = 60 * 60 * 1000;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;

// Convert between UTC and Swiss time
export function toSwissTime(utcDate: Date | string): Date {
    const date = new Date(utcDate);
    return new Date(date.getTime() + SWISS_TIMEZONE_OFFSET);
}

export function toUTC(swissDate: Date | string): Date {
    const date = new Date(swissDate);
    return new Date(date.getTime() - SWISS_TIMEZONE_OFFSET);
}

// Common Plotly config
export const commonPlotlyConfig: Partial<Config> = {
    responsive: true,
    displayModeBar: false,
    scrollZoom: false,
    doubleClick: false as const,
    modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']
};

// Common Plotly layout configuration
export function getCommonPlotlyLayout({
    isMini = false,
    allTimestamps = [],
    minFlow,
    maxFlow,
    showMidnightLines = false,
    showCurrentTimeLine = true,
    showLegend = true,
}: {
    isMini?: boolean;
    allTimestamps?: string[];
    minFlow?: number;
    maxFlow?: number;
    processedData?: { measured: ApiFlowSample[], max: ApiFlowSample[] };
    showMidnightLines?: boolean;
    showCurrentTimeLine?: boolean;
    aspectRatio?: number;
    showLegend?: boolean;
}): Partial<Layout> {
    const baseLayout: Partial<Layout> = {
        // autosize: true,
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        xaxis: {
            // tickformat: '%d.%m',
            // type: 'date' as const,
            // fixedrange: true,
            dtick: 12 * ONE_HOUR,  // Show grid every 12 hours
            showgrid: true,
            gridcolor: 'rgba(211, 211, 211, 0.5)',  // Light gray for noon grid
            gridwidth: 1,
            tickmode: 'array' as const,
            showticklabels: !isMini,
            tickvals: [],
            ticktext: []
        },
        yaxis: {
            title: { text: '' },
            fixedrange: true,
            showticklabels: !isMini,
            gridcolor: isMini ? 'transparent' : 'rgba(211, 211, 211, 0.5)',
            ticklabelposition: 'inside' as const
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
            l: 5,
            r: 5,
            t: 5,
            b: 5
        } : {
            l: 30,
            r: 30,
            t: 0,
            b: showLegend ? 0 : 30 // provide space for x-axis labels
          },
        shapes: [
            // Vertical line showing current time
            ...(showCurrentTimeLine ? [{
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
            }] : []),
            // Horizontal band for acceptable flow range
            ...(minFlow !== undefined && maxFlow !== undefined && allTimestamps.length > 0 ? [{
                type: 'rect' as const,
                x0: allTimestamps[0],
                x1: allTimestamps[allTimestamps.length - 1],
                y0: minFlow,
                y1: maxFlow,
                fillcolor: plotColors.acceptableRange.fill,
                line: { width: 0 },
                layer: 'below' as const
            }] : []),
            // Vertical lines at midnight (darker than noon grid)
            ...(showMidnightLines && allTimestamps.length > 0 ? 
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
            )
        ],
        hoverlabel: isMini ? undefined : {
            bgcolor: 'white',
            bordercolor: 'gray',
            font: { size: 13 }
        },
        hovermode: isMini ? false : 'closest' as const,
        dragmode: false as const
    };

    return baseLayout;
}

import React from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import './LineChart.css';

export interface Props {
    data: {
        date: string;
        value: number;
    }[],
    height: number;
    width: string | number;
    color: string;
    valueLabel: string;
    fontFamily: string;
    fontColor: string;
    fontSize: number;
    yAxisIntervals: number;
    showTooltips: boolean;
    yAxisPosition: string;
}

function LineChart({
    data,
    height,
    width,
    valueLabel = '',
    color = 'steelblue',
    fontFamily = 'Barlow Condensed',
    fontColor = '#000',
    fontSize = 9,
    yAxisIntervals = 5,
    yAxisPosition = 'left',
    showTooltips = true,
}: Props) {
    // Format the dates using moment.js
    const formattedData = data.map((row) => {
        const d = moment(row.date);
        return {
            Date: d.format('YYYY-MM-DD'), // adjust the format as needed,
            name: d.format('DD MMM YYYY'),
            value: [
                [d.year(), d.month() + 1, d.date()].join('/'),
                Math.round(row.value),
            ],
        };
    });

    // Sort the data by date
    formattedData.sort((a, b) => moment(a.Date).diff(moment(b.Date)));

    // const xData = formattedData.map((row) => row.Date.format('YYYY-MM-DD'));
    // const yData = formattedData.map((row) => row.value);
    let padding = {
        left: 35,
        top: 13,
        right: 5,
        bottom: 23,
        containLabel: false,
    };
    if (yAxisPosition === 'right') {
        padding = {
            left: 5,
            top: 13,
            right: 35,
            bottom: 23,
            containLabel: false,
        };
    }
    const option = {
        animation: true,
        animationThreshold: 2000000,
        grid: padding,
        textStyle: {
            fontFamily,
        },
        xAxis: {
            type: 'time',
            // data: xData,
            splitLine: {
                show: false,
            },
            axisLabel: {
                fontSize,
                color: fontColor,
            },
            axisTick: {
                lineStyle: {
                    opacity: 0.54,
                    width: 0.5,
                },
            },
            axisLine: {
                lineStyle: {
                    opacity: 0.84,
                    width: 0.5,
                },
            },
            // axisPointer: {
            //     show: true,
            //     snap: true,
            //     type: 'line',
            //     label: {
            //         show: false,
            //     },
            // },
        },
        yAxis: {
            type: 'value',
            position: yAxisPosition,
            splitNumber: yAxisIntervals,
            axisLabel: {
                fontWeight: 'normal',
                fontSize,
                color: fontColor,
                formatter: (number: any) => {
                    if (number === '-') return '-';
                    const formatter = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
                    const result = formatter.format(number);
                    if (result === 'NaN') return '-';
                    return result;
                },
            },
        },
        series: [
            {
                data: formattedData,
                type: 'line',
                itemStyle: { normal: { color } },
            },
        ],
        tooltip: {
            type: 'item',
            trigger: 'item',
            show: showTooltips,
            responsive: true,
            position: 'top',
            // formatter: '{c}',
            backgroundColor: '#fff',
            borderRadius: 0,
            borderWidth: 0.5,
            padding: 3.8,
            extraCssText: 'box-shadow: none; line-height: 1.14',
            borderColor: 'rgb(168, 168, 168)',
            formatter: (params: any) => {
                let d;
                if (Array.isArray(params)) {
                    [d] = params;
                } else {
                    d = params;
                }
                if (d.value[1] === '-') return '-';
                const formatter = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
                const result = formatter.format(d.value[1]);
                if (result === 'NaN') return '-';
                return `${d.name}<br/><b style="color: ${color};font-size: 16px">${result}</b><span style="padding-left: 3px; font-size: 9px; color: black">${valueLabel}</span>`;
            },
            textStyle: {
                color: '#000',
                fontSize: 12,
            },
        },
    };

    return (
        <div style={{ width }}>
            <ReactEcharts
                option={option}
                style={{
                    height,
                    width: '100%',
                }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    );
}

export default LineChart;

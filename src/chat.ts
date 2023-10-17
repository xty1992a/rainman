import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;

const chartDom = document.getElementById('chart')!;
const myChart = echarts.init(chartDom);

import {event} from './event.ts'
import { Man } from "./common.ts";

const option : EChartsOption= {
    title: {
        text: '速度与淋雨量统计',
    },
    grid: {
        left: '3%',
        right: '7%',
        bottom: '7%',
        containLabel: true
    },
    tooltip: {
        // trigger: 'axis',
        showDelay: 0,
        formatter: function (params: any) {
            if (params.value.length > 1) {
                return (
                    params.seriesName +
                    ' :<br/>' +
                    params.value[0] +
                    'cm ' +
                    params.value[1] +
                    'kg '
                );
            } else {
                return (
                    params.seriesName +
                    ' :<br/>' +
                    params.name +
                    ' : ' +
                    params.value +
                    'kg '
                );
            }
        },
        axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
                type: 'dashed',
                width: 1
            }
        }
    },

    brush: {},
    legend: {
        data: ['淋雨量'],
        left: 'center',
        bottom: 10
    },
    xAxis: [
        {
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value} px/s'
            },
            splitLine: {
                show: false
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value} 点'
            },
            splitLine: {
                show: false
            }
        }
    ],
    series: [
    ]
}

const state: {
    data: number[][]
} = {
    data: []
}

event.on('dead', (man: Man[]) => {
    option.series = [
        {
            name: '淋雨量',
            type: 'scatter',
            emphasis: {
                focus: 'series'
            },
            data: state.data.slice(2)
        }
    ]

    man.forEach(m => {
        state.data.push([m.speed, m.rainCount])
    })

    myChart.setOption(option);
})


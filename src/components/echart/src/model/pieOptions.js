/**
 * Echart pie base Options
 */
export default {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        data: []
    },
    series: [{
        name: '--',
        type: 'pie',
        center: ['50%', '50%'],
        data: [{
            value: 0,
            name: '暂'
        },
        {
            value: 0,
            name: '无'
        },
        {
            value: 0,
            name: '数'
        },
        {
            value: 0,
            name: '据'
        }
        ]
    }],
    color: ['#00a5d6', '#00e4e2', '#ffd970', '#ff6693', '#8078e4', '#edb9f0']
}
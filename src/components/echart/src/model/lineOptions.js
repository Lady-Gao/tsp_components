export default {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        formatter: ""
    },
    legend: {
        data: []
    },
    grid: {
        top: '40px',
        left: '30px',
        right: '40px',
        bottom: '25px',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        type: 'line',
        data: [0, 0, 0, 0]
    }]
}
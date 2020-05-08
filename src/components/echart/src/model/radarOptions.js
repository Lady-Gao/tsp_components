export default{
    title: {
        text: ''
    },
    tooltip: {
        confine: true
    },
    backgroundColor:"rgb(255, 255, 255)",
    legend: {
        data: []
    },
    radar: {
        name: {
            textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
            }
        },
        indicator: [{
                name: '疲劳',
                max: 20
            },
            {
                name: '人脸不匹配',
                max: 10
            },
            {
                name: '未识到人脸',
                max: 30
            },
            {
                name: '打电话',
                max: 20
            },
            {
                name: '离岗',
                max: 52
            },
            {
                name: '进食',
                max: 25
            },
            {
                name: '抽烟',
                max: 25
            },
            {
                name: '视线偏离',
                max: 25
            },
            {
                name: '打哈欠',
                max: 20
            },
        ]
    },
    series: [{
        name: '',
        type: 'radar',
        data: [{
            value: [],
            name: '报警分布',
            label: {
                normal: {
                    show: true,
                    formatter: function(params) {
                        return params.value;
                    }
                }
            }
        }, ]
    }]
}
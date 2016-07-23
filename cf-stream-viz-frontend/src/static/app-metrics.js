function initializeCpuLoadChart(elementId) {
    return Highcharts.chart(elementId, {
        chart: {
            type: 'solidgauge',
            marginTop: 50
        },

        title: {
            text: 'CPU Load',
            style: {
                fontSize: '24px'
            }
        },

        tooltip: {
            borderWidth: 0,
            backgroundColor: 'none',
            shadow: false,
            style: {
                fontSize: '16px'
            },
            pointFormat: '<span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
            positioner: function (labelWidth) {
                return {
                    x: 200 - labelWidth / 2,
                    y: 205
                };
            }
        },

        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [
                {
                    outerRadius: '112%',
                    innerRadius: '88%',
                    backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                    borderWidth: 0
                }
            ]
        },

        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },

        plotOptions: {
            solidgauge: {
                borderWidth: '34px',
                dataLabels: {
                    enabled: false
                },
                linecap: 'round',
                stickyTracking: false
            }
        },

        series: [{
            name: 'CPU Load',
            borderColor: Highcharts.getOptions().colors[0],
            data: createCpuLoadTrackData(0)
        }]
    });
}

function initializeMemoryUsageChart(elementId) {
    return Highcharts.chart(elementId, {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Memory Usage',
            style: {
                fontSize: '24px'
            }
        },
        xAxis: {
            categories: [''],
            crosshair: true
        },
        yAxis: {
            min: 0,
            max: 10 * 1024 * 1024,
            title: {
                text: ''
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        series: [{
            name: 'Memory Usage',
            data: createMemoryTrackData(0)
        }]
    });
}

function consumeCpuLoadStream(cpuLoadStreamUrl, cpuLoadChart) {
    const eventSource = new EventSource(cpuLoadStreamUrl);

    eventSource.onmessage = (event) => {
        const cpuLoad = Math.ceil(event.data * 100);

        cpuLoadChart.series[0].setData(createCpuLoadTrackData(cpuLoad), false);
        cpuLoadChart.redraw();
    };
}

function consumeMemoryUsageStream(memoryUsageStreamUrl, memoryUsageChart) {
    const eventSource = new EventSource(memoryUsageStreamUrl);

    eventSource.onmessage = (event) => {
        const memoryUsage = parseInt(event.data);

        memoryUsageChart.series[0].setData(createMemoryTrackData(memoryUsage), false);
        memoryUsageChart.redraw();
    };
}

function createCpuLoadTrackData(value) {
    return [{
        color: Highcharts.getOptions().colors[0],
        radius: '100%',
        innerRadius: '100%',
        y: value
    }];
}

function createMemoryTrackData(value) {
    return [value];
}

function initializeAppMetricsChart(elementId) {
    return Highcharts.chart(elementId, {
        chart: {
            type: 'solidgauge',
            marginTop: 50
        },

        title: {
            text: 'App Metrics',
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
            pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
            positioner: function (labelWidth, labelHeight) {
                return {
                    x: 200 - labelWidth / 2,
                    y: 180
                };
            }
        },

        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [
                { // Track for CPU Load
                    outerRadius: '112%',
                    innerRadius: '88%',
                    backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                    borderWidth: 0
                },
                { // Track for Memory
                    outerRadius: '87%',
                    innerRadius: '63%',
                    backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.3).get(),
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
        }, {
            name: 'Memory',
            borderColor: Highcharts.getOptions().colors[1],
            data: createMemoryTrackData(0)
        }]
    });
}

function consumeAppMetricsStreams(cpuLoadStreamUrl, appMetricsChart) {
    const eventSource = new EventSource(cpuLoadStreamUrl);

    eventSource.onmessage = (event) => {
        const cpuLoad = Math.ceil(event.data * 100);

        appMetricsChart.series[0].setData(createCpuLoadTrackData(cpuLoad));
        appMetricsChart.redraw();
    };
}

function createCpuLoadTrackData(value) {
    return createTrackData(value, 0, '100%');
}

function createMemoryTrackData(value) {
    return createTrackData(value, 1, '75%');
}

function createTrackData(value, colorIndex, percentage) {
    return [{
        color: Highcharts.getOptions().colors[colorIndex],
        radius: percentage,
        innerRadius: percentage,
        y: value
    }];
}

let data, hyperPartitionData;
const TEST_METRIC = "test_metric"
const METHOD = "method"
const CV_METRIC = "cv_metric"
const START_TIME = "start_time"
const END_TIME = "end_time"
const HYPERPARTITION_STRING = "hyperpartition_string"
const HYPERPARTITION_ID = "hyperpartition_id"
const ID = "id"
const CV_VALUES = "cv_values"
const TUNABLES = "tunables";
const HYPERPARAMETERS = "hyperparameters";
const TRANSITION_DURATION = 2000
const topN = 5; // Default value for top N classifiers
const performanceRange = [0, 1];
const performanceStep = 0.1;
var completeData = null; // summaryData

const algoColorScale = d3.scaleOrdinal()
    .domain([
        "knn", "logreg", "svm", "rf", "et", "dt", "sgd", "pa", "gnb", "bnb", "gp", "mlp", "mnb", "ada"
    ])
    .range([
        "#0000ff", // knn - blue
        "#ff0000", // logreg - red
        "#008000", // svm - green
        "#800080", // rf - purple
        "#ffa500", // et - orange
        "#1b91ac", // dt - yellow
        "#000000", // sgd - black
        "#964b00", // pa - brown
        "#ff69b4", // gnb - pink
        "#808080", // bnb - grey
        "#00ffff", // gp - cyan
        "#ff00ff", // mlp - magenta
        "#556b2f", // mnb - olive
        "#03055b" // ada - navy
    ]);
const AREA_GRAPH_SIZE_CONSTANTS = {
    "knn": {areaHeight: 0.7, color: "blue"},
    "logreg": {areaHeight: 0.1, color: "red"},
    "svm": {areaHeight: 0.3, color: "green"},
    "rf": {areaHeight: 4, color: "purple"},
    "et": {areaHeight: 1, color: "orange"},
    "dt": {areaHeight: 1, color: "yellow"},
    "sgd": {areaHeight: 2, color: "black"},
    "pa": {areaHeight: 1, color: "brown"},
    "gnb": {areaHeight: 1, color: "pink"},
    "bnb": {areaHeight: 1, color: "grey"},
    "gp": {areaHeight: 1, color: "cyan"},
    "mlp": {areaHeight: 1, color: "magenta"},
    "mnb": {areaHeight: 3, color: "olive"},
    "ada": {areaHeight: 1.5, color: "navy"}
};

document.addEventListener('DOMContentLoaded', async () => {
    data = await loadJsonData(data, "../SampleData/classifiersData.json");
    completeData = data;
    data = wrangleData(data)
    hyperPartitionData = await loadJsonData(data, "../SampleData/hyperparametersData.json")
    const hyperPartitionStringToDetailsMap = getHyperPartitionStringToDetailsMap(data, hyperPartitionData)
    const testMetricFreqMap = aggregateTestMetricCount()
    const testMetricByAlgoFreqMap = aggregateTestMetricCountByAlgorithm()
    // plotF1scoreVsNumberOfClassifiersBarChart(testMetricFreqMap)
    // plotAlgorithmsBarChart(testMetricByAlgoFreqMap)
    plotTrialsBarChart(data, true)
    // plotHyperPartitionBarChart(hyperPartitionStringToDetailsMap)
    // plotHyperPartitionBarChartByAlgo(hyperPartitionStringToDetailsMap, "dt")
    // plotHyperParametersChart(data);

    completeData.sort((a, b) => b.test_metric - a.test_metric);
    plotData();
    addListeners()

});


function addListeners() {
    const dataView = document.getElementById('dataView');
    const overviewView = document.getElementById('overviewView');
    const dataButton = document.getElementById('dataButton');
    const overviewButton = document.getElementById('overviewButton');

    dataButton.addEventListener('click', () => {
        dataView.classList.remove('hide');
        overviewView.classList.add('hide');
    });

    overviewButton.addEventListener('click', () => {
        dataView.classList.add('hide');
        overviewView.classList.remove('hide');
    });
}

const getHyperPartitionStringToDetailsMap = (data, hyperPartitionData) => {
    let hyperPartitionStringToDetailsMap = {}
    let hyperPartitionIdToCVMap = {}
    hyperPartitionData.forEach(d => {
        hyperPartitionStringToDetailsMap[d[HYPERPARTITION_STRING]] = {id: d[ID]}
    })
    data.forEach(d => {
        if (d[HYPERPARTITION_ID] in hyperPartitionIdToCVMap) {
            hyperPartitionIdToCVMap[d[HYPERPARTITION_ID]].push({cv_metric: d[CV_METRIC], id: d[ID], method: d[METHOD]})
        } else {
            hyperPartitionIdToCVMap[d[HYPERPARTITION_ID]] = [{cv_metric: d[CV_METRIC], id: d[ID], method: d[METHOD]}]
        }
    })

    Object.keys(hyperPartitionStringToDetailsMap).forEach(key => {
        const hyperPartitionId = hyperPartitionStringToDetailsMap[key][ID]
        hyperPartitionStringToDetailsMap[key][CV_VALUES] = hyperPartitionIdToCVMap[hyperPartitionId]
        hyperPartitionStringToDetailsMap[key][METHOD] = hyperPartitionIdToCVMap[hyperPartitionId][0][METHOD]

    });

    return hyperPartitionStringToDetailsMap

}

const plotHyperPartitionBarChartByAlgo = (hyperPartitionData, algo) => {
    for (const [hyperpartitionString, details] of Object.entries(hyperPartitionData)) {
        if (details[METHOD] !== algo)
            continue
        plotVerticalBarChart(details[CV_VALUES], CV_METRIC, false, 35, 400, 150, false, true, hyperpartitionString, "")
    }
}

const plotHyperPartitionBarChart = (hyperPartitionData) => {
    for (const [hyperpartitionString, details] of Object.entries(hyperPartitionData)) {
        plotVerticalBarChart(details[CV_VALUES], CV_METRIC, false, 35, 400, 150, false, true, "", "")
    }
}

const plotTrialsBarChart = (data, orderByTime) => {
    if (orderByTime)
        data.sort((a, b) => a[END_TIME] - b[END_TIME])
    else
        data.sort((a, b) => b[TEST_METRIC] - a[TEST_METRIC])

    return plotVerticalBarChart(data, TEST_METRIC, true, 1, 1500, 180, true, false)

}
const plotAlgorithmsBarChart = (testMetricByAlgoFreqMap) => {
    for (const [algo, testMetricFreqMap] of Object.entries(testMetricByAlgoFreqMap)) {
        plotHorizontalBarChart(testMetricFreqMap, algo, "", algo, 460, 280)
    }
}
const plotF1scoreVsNumberOfClassifiersBarChart = (testMetricFreqMap) => {
    return plotHorizontalBarChart(testMetricFreqMap, "Number of classifiers", "F1 score", "svg1", 460, 400)
}
const wrangleData = (data) => {
    return data.map(d => {
        d[TEST_METRIC] = parseFloat(parseFloat(d[TEST_METRIC]).toFixed(1));
        d[CV_METRIC] = parseFloat(parseFloat(d[CV_METRIC]).toFixed(3));
        d[START_TIME] = new Date(d[START_TIME])
        d[END_TIME] = new Date(d[END_TIME])

        return d;
    });
};

const aggregateTestMetricCount = () => {
    let testMetricFreqMap = {}
    for (const element of [0, 0.2, 0.4, 0.6, 0.8]) {
        testMetricFreqMap[element] = 0
    }
    data.forEach(d => {
        if (d[TEST_METRIC] in testMetricFreqMap) {
            testMetricFreqMap[d[TEST_METRIC]] += 1
        } else {
            testMetricFreqMap[d[TEST_METRIC]] = 1
        }
    })
    return testMetricFreqMap
}
const aggregateTestMetricCountByAlgorithm = () => {
    let testMetricByAlgoFreqMap = {}
    data.forEach(d => {
        if (d[METHOD] in testMetricByAlgoFreqMap) {
            if (d[TEST_METRIC] in testMetricByAlgoFreqMap[d[METHOD]]) {
                testMetricByAlgoFreqMap[d[METHOD]][d[TEST_METRIC]] += 1
            } else {
                testMetricByAlgoFreqMap[d[METHOD]][d[TEST_METRIC]] = 1
            }
        } else {
            testMetricByAlgoFreqMap[d[METHOD]] = {}
            for (const element of [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
                testMetricByAlgoFreqMap[d[METHOD]][element] = 0
            }
            testMetricByAlgoFreqMap[d[METHOD]][d[TEST_METRIC]] = 1
        }
    })
    return testMetricByAlgoFreqMap
}

const getTootTip = () => {
    return d3
        .select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '2px')
        .style('border-radius', '5px')
        .style('padding', '5px');
}

const loadJsonData = async (data, path) => {
    return d3.json(path).then(function (csvData) {
        data = csvData;
        return data
    }).catch(function (error) {
        console.error("Error loading the CSV file: ", error);
    });
}


const plotHorizontalBarChart = (data, xAttributeLabel, yAttributeLabel, svgId, userWidth, UserHeight) => {
    let dataArray = Object.keys(data).map(key => ({y: parseFloat(key), x: data[key]}));
    dataArray.sort((a, b) => a.y - b.y)

    const margin = {top: 20, right: 30, bottom: 40, left: 90}, width = userWidth - margin.left - margin.right,
        height = UserHeight - margin.top - margin.bottom;

    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("id", `${svgId}`)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear()
        .domain([d3.min(dataArray, d => parseFloat(d.x)), d3.max(dataArray, d => parseFloat(d.x))])
        .range([0, width]);

    const tickValues = d3.range(0, 1, 0.1);
    const xAxis = d3.axisBottom(x)
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
    // .selectAll("text")
    // .attr("transform", "translate(-10,0)rotate(-45)")
    // .style("text-anchor", "end");

    const y = d3.scaleBand()
        .range([height, 0])
        .domain(dataArray.map(d => d.y))
        .padding(.1);
    const yAxis = d3.axisLeft(y)
    // .tickValues(tickValues);

    svg.append("g")
        .call(yAxis)

    const rects = svg.selectAll("myRect")
        .data(dataArray)
        .join(
            enter => enter.append("rect")
                .attr("x", 0)
                .attr("y", d => y(d.y) - 8)
                .attr("width", 0)
                .attr("height", 18)
                .attr("fill", () => {
                    if (yAttributeLabel === "Number of classifiers") {
                        return "#2974a2"
                    } else
                        return algoColorScale(svgId)
                })
                .transition()
                .duration(TRANSITION_DURATION)
                .attr("width", d => x(d.x)),
            update => update
                .attr("x", 0)
                .attr("y", d => y(d.y) - 14)
                .attr("width", d => x(d.x))
                .attr("height", 28)
                .attr("fill", () => {
                    if (yAttributeLabel === "Number of classifiers") {
                        return "#2974a2"
                    } else
                        return algoColorScale(svgId)
                }),
            exit => exit.remove()
        );

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom)
        .attr('text-anchor', 'middle')
        .attr("class", "scatterPlotXLabel")
        .style("font-size", "12px")
        .text(xAttributeLabel);

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -0.4 * width)
        .attr('y', margin.left / 2 - 80)
        .attr('text-anchor', 'middle')
        .attr("class", "scatterPlotYLabel")
        .style("font-size", "12px")
        .text(yAttributeLabel);
}

const plotVerticalBarChart = (data, yAttribute, lineChart, rectWidth, svgWidth, svgHeight, yTicksEnabled, xTicksEnabled, xLabel, yLabel) => {
    let i = 1
    data.map(d => d["index"] = i++)
    const margin = {top: 10, right: 30, bottom: 90, left: 40}, width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map((d, i) => i))
        .padding(0.8);
    let xAxis = d3.axisBottom(x)

    if (!xTicksEnabled)
        xAxis = xAxis.tickFormat(() => "").tickSize(0)

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
    // .selectAll("text")
    // .attr("transform", "translate(-10,0)rotate(-45)")
    // .style("text-anchor", "end");

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d[yAttribute]), d3.max(data, d => d[yAttribute])])
        .range([height, 0]);

    let yAxis = d3.axisLeft(y)
    if (!yTicksEnabled)
        yAxis = yAxis.tickFormat(() => "").tickSize(0)

    svg.append("g")
        .call(yAxis);

    let tooltip = getTootTip();

    const rects = svg.selectAll("mybar")
        .data(data)
        .join(
            enter => enter.append("rect")
                .attr("x", (d, i) => x(i))
                .attr("width", rectWidth !== null ? rectWidth : x.bandwidth())
                .attr("fill", (d) => algoColorScale(d.method))
                .style("stroke-width", "12px")
                .attr("height", 0)
                .attr("y", d => height)
                .on('mouseover', function (event, d) {
                    tooltip.style('visibility', 'visible');
                    if (d[ID] !== undefined) {
                        scatterHover(d[ID]);
                    }
                })
                .on('mousemove', function (event, d) {
                    tooltip
                        .style('top', event.pageY - 10 + 'px')
                        .style('left', event.pageX + 10 + 'px')
                    tooltip.html(`${d.index}: ${d[yAttribute]}`);
                })
                .on('mouseout', function (event, d) {
                    tooltip.style('visibility', 'hidden');
                    if (d[ID] !== undefined) {
                        scatterHoverReset();
                    }
                }),
            update => update
                .attr("x", (d, i) => x(i))
                .attr("width", rectWidth !== null ? rectWidth : x.bandwidth())
                .attr("fill", (d) => algoColorScale(d.method))
                .style("stroke-width", "12px")
                .attr("height", d => height - y(d[yAttribute]))
                .attr("y", d => y(d[yAttribute])),
            exit => exit.remove()
        );

    rects.transition()
        .duration(TRANSITION_DURATION)
        .attr("y", d => y(d[yAttribute]))
        .attr("height", d => height - y(d[yAttribute]))
        .delay((d, i) => {
            return i * 4
        })
        .attr("fill", (d) => algoColorScale(d.method))
    // .style("filter", "brightness(100%) saturate(800%)");

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 50)
        .attr('text-anchor', 'middle')
        .attr("class", "scatterPlotXLabel")
        .style("font-size", "12px")
        .text(xLabel);
    //
    // svg.append('text')
    //     .attr('transform', 'rotate(-90)')
    //     .attr('x', width/2)
    //     .attr('y', height + margin.bottom-50)
    //     .attr('text-anchor', 'middle')
    //     .attr("class", "scatterPlotYLabel")
    //     .style("font-size", "12px")
    //     .text(yLabel);
    if (lineChart === false)
        return

    let maxHeight = 0;
    let maxPoints = [];
    let inclineStarted = false;

    data.forEach((d, i) => {
        if (d[yAttribute] > maxHeight) {
            maxHeight = d[yAttribute];
            inclineStarted = true;
        }
        if (inclineStarted) {
            maxPoints.push({x: i, y: maxHeight, isMax: true});
            inclineStarted = false;

        } else {
            maxPoints.push({x: i, y: maxPoints[maxPoints.length - 1].y, isMax: false});
        }
    });

    const line = d3.line()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

    svg.append("path")
        .datum(maxPoints)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("opacity", 0.5)
        .attr("d", line);

    maxPoints.forEach((d) => {
        if (d.isMax)
            svg.append("circle")
                .attr("cx", x(d.x))
                .attr("cy", y(d.y))
                .attr("r", 5)
                .attr("fill", "red");
    });
}

const createHyperPartitionsChartData = (method) => {
    let tunables;
    for (let d of hyperPartitionData) {
        if (d[METHOD] === method) {
            var element = {};
            element["x"] = d[TUNABLES]
            tunables = d[TUNABLES];
            break;
        }
    }

    let hyperParametersChartData = [];
    Object.keys(tunables).forEach(key => {
        hyperParametersChartData[key] = [];
        data.forEach(d => {
            if (d[METHOD] === method) {
                var element = {};
                element["x"] = d[HYPERPARAMETERS][key];
                element["y"] = d[CV_METRIC];
                element["color"] = algoColorScale(method);
                element["id"] = d[ID];
                hyperParametersChartData[key].push(element);
            }
        });
    });

    let keys = Object.keys(hyperParametersChartData);

    return {hyperParametersChartData, keys};
}

function drawScatterAndDensity(scatterData, method, key) {
    // Create a unique container ID for each pair of plots
    const containerId = `container-${key}`;

    // Dynamically create a new div for this pair of plots
    const newContainer = document.createElement('div');
    newContainer.id = containerId;
    document.getElementById('hyperparameters-container').appendChild(newContainer);

    // Set dimensions for the plots
    const margin = {top: 10, right: 30, bottom: 5, left: 40};
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    // Create an SVG container for the scatter plot
    const svgScatter = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    xScale = d3.scaleLinear()
        .domain([d3.min(scatterData, d => d.x), d3.max(scatterData, d => d.x)])
        .range([0, width]);
    xAxis = svgScatter.append("g")
        .attr("transform", "translate(0," + height + ")") // Move axis to the bottom of the SVG container
        .call(d3.axisBottom(xScale).tickFormat(() => "").tickSize(0))
        .selectAll("text").remove();

    yScale = d3.scaleLinear()
        .domain([d3.min(scatterData, d => d.y), d3.max(scatterData, d => d.y)])
        .range([height, 0]);
    yAxis = svgScatter.append("g")
        .call(d3.axisLeft(yScale));

    svgScatter.selectAll(".scatterPoints")
        .data(scatterData)
        .join(
            enter => enter.append("circle")
                // .transition()
                // .duration(500)
                .attr("cx", (d) => {
                    return xScale(d.x);
                })
                .attr("cy", (d) => {
                    return yScale(d.y);
                })
                .attr("r", 3) // Radius of the circle
                .style("fill", algoColorScale(method)) // Color of the circles(d) => d.color
                .attr("class", "scatterPoints")
                .attr("transfrorm", "translate(0, " + height + ")")
        );

    // Create an SVG container for the density graph
    const svgDensity = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", "150") // Adjust the height as needed
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    xScale = d3.scaleLinear()
        .domain([d3.min(scatterData, d => d.x), d3.max(scatterData, d => d.x)])
        .range([0, width]);
    xAxis = svgDensity.append("g")
        .attr("transform", "translate(0," + 80 + ")") // Move axis to the bottom of the SVG container
        .call(d3.axisBottom(xScale));

    svgDensity.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (120) + ")")
        .style("text-anchor", "middle")
        // .attr("stroke", AREA_GRAPH_SIZE_CONSTANTS[method]["color"])
        .style("font-size", "12px")
        .text(key);


    yScale = d3.scaleLinear()
        .domain([0, AREA_GRAPH_SIZE_CONSTANTS[method]["areaHeight"]])
        .range([80, 0]);

    yAxis = svgDensity.append("g")
        .call(d3.axisLeft(yScale))
        .attr("class", "densityYAxis");

    d3.selectAll(".densityYAxis").remove();

    // Compute kernel density estimation
    let kde = kernelDensityEstimator(kernelEpanechnikov(0.1), xScale.ticks(40));
    let density = kde(scatterData.map(d => d.x));

    density.unshift([density[0][0], 0]);
    density.push([density[density.length - 1][0], 0]);

    // Plot the area
    svgDensity.append("path")
        .attr("class", "mypath")
        .datum(density)
        .attr("fill", algoColorScale(method))
        .attr("opacity", "1")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(function (d) {
                return xScale(d[0]);
            })
            .y(function (d) {
                return yScale(d[1]);
            }));
}

const kernelDensityEstimator = (kernel, X) => {
    return (V) => {
        return X.map((x) => {
            return [x, d3.mean(V, function (v) {
                return kernel(x - v);
            })];
        });
    };
}
const kernelEpanechnikov = (k) => {
    return (v) => {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}

const plotHyperParametersChart = (method) => {
    method = "dt"; // This is dummy, replace it with the actual method
    let hyperParametersChartsData = createHyperPartitionsChartData(method);
    for (let i = 0; i < hyperParametersChartsData.keys.length; i++) {
        let key = hyperParametersChartsData.keys[i];
        let plotData = hyperParametersChartsData.hyperParametersChartData[key];
        drawScatterAndDensity(plotData, method, key);
    }
}

const scatterHover = (id) => {
    // Select all the points in which the id matches
    // For that, we add radius and stroke to the selected points and reduce opacity of the rest
    d3.selectAll(".scatterPoints")
        .style("opacity", 0.3)
        .style("stroke", "none")
        .style("stroke-width", 0);

    d3.selectAll(".scatterPoints")
        .filter(d => d.id === id)
        .style("opacity", 1)
        .style("stroke", "black")
        .style("stroke-width", 1);

}

const scatterHoverReset = () => {
    // Reset all the points to their original state
    d3.selectAll(".scatterPoints")
        .style("opacity", 1)
        .style("stroke", "none")
        .style("stroke-width", 0);
}

function switchTab(tabId) {
    // Hide all content divs
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.style.display = 'none');

    // Show the selected content
    const selectedContent = document.getElementById(`content${tabId.slice(-1)}`);
    selectedContent.style.display = 'block';

    // Optional: Add animation for switching tabs
    selectedContent.classList.add('slide-in');
    setTimeout(() => selectedContent.classList.remove('slide-in'), 500);
}

document.getElementById('topNForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const topNValue = parseInt(document.getElementById('topN').value, 10);
    showTopClassifiers(topNValue);
    plotHorizontalBarChartOverview();
});

function plotHorizontalBarChartOverview() {
    const data = [
        {range: '0 - 0.1', count: 0},
        {range: '0.1 - 0.2', count: 0},
        {range: '0.2 - 0.3', count: 0},
        {range: '0.3 - 0.4', count: 0},
        {range: '0.4 - 0.5', count: 0},
        {range: '0.5 - 0.6', count: 0},
        {range: '0.6 - 0.7', count: 0},
        {range: '0.7 - 0.8', count: 0},
        {range: '0.8 - 0.9', count: 0},
        {range: '0.9 - 1.0', count: 0},
        {range: '1.0', count: 0}
    ];
    // extract all the test metric from jsonData into variable dataArray
    const dataArray = completeData.map(d => d.test_metric);
    const maxCount = Math.max(...data.map(item => item.count));

    dataArray.forEach(value => {
        const index = Math.floor(value * 10); // Determine which range this value falls into
        data[index].count++; // Increment the count for that range
    });

    const svgWidth = 600;
    const svgHeight = 400;
    const margin = {top: 20, right: 20, bottom: 60, left: 60};
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const barPlotDiv = document.getElementById('barPlot');
    barPlotDiv.innerHTML = '';

    const svg = d3.select('#barPlot')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count) * 1.1]) // Add 10% margin
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.range))
        .range([height, 0]) // Reversed range for y-axis
        .padding(0.1);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`) // Move x-axis to the bottom
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(y))
        .selectAll('.tick text')
        .attr('transform', `translate(${0}, 0)`); // Adjust text position

    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => y(d.range))
        .attr('width', d => x(d.count))
        .attr('height', y.bandwidth())
        .attr("fill", 'steelblue'); // Changed fill color to steelblue

    svg.selectAll('.text-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'text-label')
        .attr('x', d => x(d.count) + 5)
        .attr('y', d => y(d.range) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .text(d => d.count);

    svg.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom / 2)
        .style('text-anchor', 'middle')
        .text('Count of test metrics in range');

    svg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left)
        .attr('dy', '0.71em')
        .style('text-anchor', 'middle')
        .text('Range of test metrics');
}

function showTopClassifiers(topN) {
    const topClassifiersDiv = document.getElementById('topClassifiers');
    topClassifiersDiv.innerHTML = ''; // Clear existing content

    // Keep track of the currently expanded card
    let currentlyExpanded = null;
    completeData.sort((a, b) => b.test_metric - a.test_metric);

    completeData.slice(0, topN).forEach((d, index) => {
        const card = document.createElement('div');
        card.className = 'card mt-3';
        const headerId = `heading${index + 1}`;
        const collapseId = `collapse${index + 1}`;

        // For hyperparameters
        const hyperparametersObj = d.hyperparameters;

        card.innerHTML = `
            <div class="card-header" id="${headerId}">
                <h5 class="mb-0">
                    <button class="btn btn-link" data-toggle="collapse" data-target="#${collapseId}"
                        aria-expanded="true" aria-controls="${collapseId}">
                        <span class="arrow"></span> ${d.method}: ${d.cv_metric} +- ${d.cv_metric_std}
                    </button>
                </h5>
            </div>
            <div id="${collapseId}" class="collapse" aria-labelledby="${headerId}" data-parent="#topClassifiers">
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        ${Object.entries(hyperparametersObj).map(([key, value]) => `<li class="list-group-item">${key}: ${value}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        // Add event listener to toggle arrow icon and collapse state
        card.addEventListener('click', function () {
            const collapseElement = document.getElementById(collapseId);

            // Check if this card is already expanded
            const isExpanded = collapseElement.classList.contains('show');

            // Close the currently expanded card, if any
            if (currentlyExpanded && currentlyExpanded !== collapseElement && !isExpanded) {
                currentlyExpanded.classList.remove('show');
                currentlyExpanded.parentElement.querySelector('.arrow').classList.add('collapsed');
            }

            // Toggle arrow icon and collapse state
            collapseElement.classList.toggle('show');
            card.querySelector('.arrow').classList.toggle('collapsed');

            // Update the currently expanded card
            currentlyExpanded = isExpanded ? null : collapseElement;
        });

        topClassifiersDiv.appendChild(card);
    });

}

function plotData() {
    // Load data from CSV
    d3.csv("blood.csv").then(data => {
        // Extract column names except "class"
        const columns = Object.keys(data[0]).filter(col => col !== "class");

        // Create summary
        createSummary(data.length, columns.length, getClassSummary(data));

        // Create a chart for each column
        columns.forEach((col, index) => {
            createChart(data, col, `chart-${index}`);
        });
    });
}

function createSummary(numRows, numColumns, classSummary) {
    const summaryDiv = d3.select("#summary");

    // Add overview information
    summaryDiv.append("p")
        .text(`${numColumns} features / ${numRows} instances / ${classSummary.length} classes`);

    // Add feature distribution
    summaryDiv.append("p")
        .text("Feature Distribution");

    // Add class summary
    const classSummaryList = summaryDiv.append("ul");
    classSummary.forEach(item => {
        const listItem = classSummaryList.append("li").classed("list-group-item d-flex align-items-center", true);

        // Create a div for the color icon
        const colorIconDiv = listItem.append("div")
            .classed("color-box mr-3", true)
            .style("background-color", item.color)
            .style("width", "20px")
            .style("height", "20px"); // Adjust size as needed

        // Add the count and class name
        listItem.append("span")
            .style("color", 'black')
            .text(`${item.count}`);

        listItem.append("span")
            .style("color", "black") // Keep this span black
            .html(`&nbsp;&nbsp;&nbsp;&nbsp;class = ${item.className} `);
    });
}


function getClassSummary(data) {
    const uniqueClassValues = new Set(data.map(row => row['class']));
    const uniqueClassCount = uniqueClassValues.size;
    const colorScale = d3.scaleOrdinal()
        .domain(uniqueClassValues)
        .range(d3.schemeCategory10);
    const classCounts = {};
    data.forEach(row => {
        const className = row.class;
        if (classCounts[className]) {
            classCounts[className]++;
        } else {
            classCounts[className] = 1;
        }
    });

    const classSummary = Object.keys(classCounts).map(className => {
        const count = classCounts[className];
        const color = colorScale(className) || "#000000"; // Get color based on class name
        const colorIcon = `<span style="display: inline-block; width: 20px; height: 20px; background-color: ${color}; margin-right: 5px;"></span> ${className}: ${count}`;

        return {className, count, color, colorIcon};
    });

    return classSummary;
}

function createChart(data, column, containerId) {

    // Calculate intervals
    const classData = data.map(row => row['class']);
    var columnData = data.map(row => row[column]);
    columnData = columnData.map(Number).filter(Number.isFinite);
    columnData = columnData.map(d => parseFloat(d.toFixed(2)));
    const uniqueClassValues = new Set(data.map(row => row['class']));
    const uniqueClassCount = uniqueClassValues.size;

    // If columnData is empty, return early
    if (columnData.length === 0) {
        console.log('columnData is empty. Returning early.');
        return;
    }

    const minV1 = d3.min(columnData);
    const maxV1 = d3.max(columnData);
    const intervalCount = 15;
    const intervalSize = parseFloat(((maxV1 - minV1) / intervalCount).toFixed(2));

    // Prepare data for intervals and categories
    const intervals = [];
    for (let i = 0; i < intervalCount; i++) {
        const intervalValue = minV1 + i * intervalSize;
        if (intervalValue !== undefined) {
            intervals.push({
                interval: intervalValue,
                counts: new Map(),
            });
        }
    }

    columnData.forEach((d, index) => {
        const intervalIndex = Math.floor((d - minV1) / intervalSize);
        const interval = intervals[intervalIndex];
        if (interval && !interval.counts.has(classData[index])) {
            interval.counts.set(classData[index], 1);
        } else if (interval) {
            interval.counts.set(classData[index], interval.counts.get(classData[index]) + 1);
        }
    });

    // D3 code to create the bar plot
    const svgWidth = 800;
    const svgHeight = 400;
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Create a container for the chart
    const container = d3.select("#charts")
        .append("div")
        .attr("id", containerId)
        .style("margin-bottom", "20px");

    // Add chart heading
    container.append("h3")
        .text(column);

    const svg = container.append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand()
        .domain(intervals.map(d => d.interval))
        .range([0, width])
        .padding(0.1);

    let overallMaxCount = 0;
    let overallMinCount = Infinity;
    intervals.forEach(interval => {
        interval.counts.forEach(count => {
            overallMaxCount = Math.max(overallMaxCount, count);
            overallMinCount = Math.min(overallMinCount, count);
        });
    });

    // Update y-axis scale with overall maximum and minimum values
    const y = d3.scaleLinear()
        .domain([overallMinCount, Math.round(overallMaxCount * 1.05)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text") // Rotate x-axis labels if needed for better readability
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em");

    svg.append("g")
        .call(d3.axisLeft(y));

    const colorScale = d3.scaleOrdinal()
        .domain(uniqueClassValues)
        .range(d3.schemeCategory10);


    let tooltip = getTootTip();

    // D3 code to create the bar plot
    intervals.forEach((interval, intervalIndex) => {
        const barWidth = x.bandwidth() / interval.counts.size;
        let xOffset = 0;

        interval.counts.forEach((count, category) => {
            svg.append("rect")
                .attr("x", x(interval.interval) + xOffset)
                .attr("y", y(count))
                .attr("width", barWidth)
                .attr("height", height - y(count))
                .attr("fill", colorScale(category))
                .on('mouseover', function (event, d) {
                    tooltip.style('visibility', 'visible');
                })
                .on('mousemove', function (event, d) {
                    tooltip
                        .style('top', event.pageY - 10 + 'px')
                        .style('left', event.pageX + 10 + 'px')
                    tooltip.html(`class ${category} : ${count}
                        <br>
                        <div style="background-color: ${colorScale(category)}; ">
                        &nbsp;&nbsp;
                        ${(minV1 + intervalIndex * intervalSize).toFixed(2)} ~ ${(minV1 + (1 + intervalIndex) * intervalSize).toFixed(2)}</div>`);
                })
                .on('mouseout', function (event, d) {
                    tooltip.style('visibility', 'hidden');
                });

            xOffset += barWidth;
        });
    });
}

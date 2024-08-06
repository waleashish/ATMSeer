import * as d3 from "d3";
import { ID, TOOLTIP, TRANSITION_DURATION, algoColorScale, verticalBarPlotMargins, horizontalBarPlotMargins } from "@/utils/constants";



const getScales = (
  width: number,
  height: number,
  data: any,
  yAttribute: any
) => {
  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((d: any, i: number) => i))
    .padding(0.8);

  const domain: [number, number] = d3.extent(data, (d: any) => d[yAttribute]) as unknown as [number, number];
  domain[0] = 0
  const yScale = d3
    .scaleLinear()
    .domain(domain)
    .range([height, 0]);

  return { xScale, yScale };
}


export const plotVerticalBarChart = (
  selector: any,
  data: any,
  yAttribute: any,
  lineChart: any,
  rectWidth: any,
  svgWidth: any,
  svgHeight: any,
  yTicksEnabled: any,
  xTicksEnabled: any,
  label: string,
) => {

  let i = 1;
  data.map((d: { [x: string]: number; }) => (d["index"] = i++));

  const width = svgWidth - verticalBarPlotMargins.left - verticalBarPlotMargins.right;
  const height = svgHeight - verticalBarPlotMargins.top - verticalBarPlotMargins.bottom;

  const { xScale, yScale } = getScales(width, height, data, yAttribute);

  const nTicks = 5
  let xAxis = d3.axisBottom(xScale)
  console.log('xAxis domain length')
  console.log(xScale.domain().length)
  xAxis
    .tickValues(xScale.domain().filter((d: any, i: any) => (i % Math.ceil(xScale.domain().length / nTicks)) === 0))

  if (!xTicksEnabled) xAxis = xAxis.tickFormat(() => "").tickSize(0);

  let yAxis = d3.axisLeft(yScale);
  yAxis.ticks(10);
  if (!yTicksEnabled) yAxis = yAxis.tickFormat(() => "").tickSize(0);

  const axes = selector.select('g.axes')
  console.log('axes')
  console.log(axes)
  if (axes.empty()) {
    const newAxes = selector
      .append('g')
      .attr('class', 'axes')
      //.call(drawAxis, height, xScale, yScale, xTicksEnabled, yTicksEnabled);

    newAxes.append("g").attr("transform", `translate(0,${height})`).attr('class', 'x-axis').call(xAxis);
    newAxes.append("g").attr('class', 'y-axis').call(yAxis);
  } else {
    axes.select('g.x-axis').transition().call(xAxis)
    axes.select('g.y-axis').transition().call(yAxis)
  }

  let plot = selector.select('g.plot')
  if (plot.empty()) {
    plot = selector.append('g').attr('class', 'plot');
  }

  const textPlot = selector.select('g.textPlot')
  if (textPlot.empty()) {
    selector.append('g').attr('class', 'textPlot')
      .append("text")
      .attr('class', 'label')
      .attr("transform", `translate(${(width / 2)},  ${height + 15})`)
      .style("text-anchor", "middle")
      .style('font-size', '12px')
      .text(label);
  }

  // (rohan): changed the selector
  // TODO (rohan): fiddle with the rectangle creation to get better animation
  const t = selector.transition().duration(TRANSITION_DURATION)
  const rects = plot.selectAll("rect.mybar")
      .data(data)
      .join(
        (enter: any) => enter
              .append("rect")
              .attr("class", "mybar")
              // .attr("x", (d: any, i: string) => xScale(i))
              .attr('x', width+30)  // push it out, and then animate it sliding in
              .attr("width", rectWidth !== null ? rectWidth : xScale.bandwidth())
              .attr("fill", (d: { method: string; }) => algoColorScale(d.method))
              .style("stroke-width", "12px")
              .attr("height", 0)
              .attr('y', (d: any) => yScale(d[yAttribute]))
              .call((enter: any) => enter
                .transition()
                .attr('x', (d: any, i: string) => xScale(i))
                .attr('height', (d: any) => height - yScale(d[yAttribute]))
              )
              .on('mouseover', function (event: any, d: { [x: string]: any; }) {
                  TOOLTIP.style('visibility', 'visible');
                  if (d[ID] !== undefined) {
                      scatterHover(d[ID]);
                  }
              })
              .on('mousemove', function (event: { pageY: number; pageX: number; }, d: { [x: string]: any; index: any; }) {
                  TOOLTIP
                      .style('top', event.pageY - 10 + 'px')
                      .style('left', event.pageX + 10 + 'px')
                  TOOLTIP.html(`${d.index}: ${d[yAttribute]}`);
              })
              .on('mouseout', function (event: any, d: { [x: string]: undefined; }) {
                  TOOLTIP.style('visibility', 'hidden');
                  if (d[ID] !== undefined) {
                      scatterHoverReset();
                  }
              }),

        (update: any) => update
              // .attr("x", (d: any, i: string) => xScale(i))
              // .attr("width", rectWidth !== null ? rectWidth : xScale.bandwidth())
              .attr("fill", (d: { method: string; }) => algoColorScale(d.method))
              .style("stroke-width", "12px")
              // .attr("y", (d: { [x: string]: d3.NumberValue; }) => yScale(d[yAttribute])),
              .call((update: any) => update
                .transition(t)
                .attr('x', (d: any, i: string) => xScale(i))
                .attr('y', (d: any) => yScale(d[yAttribute]))
                .attr('width', rectWidth !== null ? rectWidth : xScale.bandwidth())
                .attr("height", (d: { [x: string]: d3.NumberValue; }) => height - yScale(d[yAttribute]))
              ),

        // Will probably not be used
        (exit: { remove: () => any; }) => exit.remove()
      );

  if (lineChart === false)
      return

  // TODO (rohan): How do I animate this?
  let maxHeight = 0;
  let maxPoints: any = [];
  let inclineStarted = false;

  data.forEach((d: { [x: string]: number; }, i: any) => {
      if ((d[yAttribute] > maxHeight) || i === 0) {
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
      .x((d: any) => xScale(d.x) as number)
      .y((d: any) => yScale(d.y) as number)

  let lineChartGroup = selector.select('g.lineChart')
  console.log('lineChartGroup')
  console.log(lineChartGroup)
  if (lineChartGroup.empty()) {
    lineChartGroup = selector.append('g').attr('class', 'lineChart');
  }
  lineChartGroup
    .selectAll('path')
    .data([maxPoints])
    .join(
      (enter: any) => enter
        .append('path')
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("opacity", 0.5)
        .attr("d", line),

      (update: any) => update
        // .attr('d', line)
        .call((update: any) => update
          .transition(t)
          .attr("d", line),
        )
    )

  // selector.append("path")
  //     .datum(maxPoints)
  //     .attr("fill", "none")
  //     .attr("stroke", "black")
  //     .attr("stroke-width", 1)
  //     .style("opacity", 0.5)
  //     .attr("d", line);

  // maxPoints.forEach((d: any) => {
  //     if (d.isMax)
  //         selector.append("circle")
  //             .attr("cx", xScale(d.x))
  //             .attr("cy", yScale(d.y))
  //             .attr("r", 5)
  //             .attr("fill", "red");
  // });

  // rewrite the above using `.filter` method
  console.log('maxPoints')
  console.log(maxPoints)
  const onlyMaxPoints = maxPoints.filter((d: { isMax: any; }) => d.isMax)
  console.log('onlyMaxPoints')
  console.log(onlyMaxPoints)
  lineChartGroup.selectAll("circle")
      .data(onlyMaxPoints)
      .join(
        (enter: any) => enter
          .append("circle")
          .attr("cx", (d: any) => xScale(d.x))
          .attr("cy", (d: any) => yScale(d.y))
          .attr("r", 5)
          .attr("fill", "red"),

        (update: any) => update
          .call((update: any) => update
            .transition(t)
            .attr("cx", (d: any) => xScale(d.x))
            .attr("cy", (d: any) => yScale(d.y))
          ),
      )
}



const scatterHover = (id: any) => {
  // Select all the points in which the id matches
  // For that, we add radius and stroke to the selected points and reduce opacity of the rest
  d3.selectAll(".scatterPoints")
      .style("opacity", 0.3)
      .style("stroke", "none")
      .style("stroke-width", 0);

  d3.selectAll(".scatterPoints")
      .filter((d: any) => d.id === id)
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



export const plotHorizontalBarChart = (
  selector: any,
  data: any,
  xAttributeLabel: string,
  yAttributeLabel: string,
  svgWidth: number,
  svgHeight: number,
  label: string,
) => {
  const dataArray = Object.keys(data).map(key => ({ y: parseFloat(key), x: data[key] }));
  console.log('dataArray')
  console.log(dataArray)

  dataArray.sort((a, b) => a.y - b.y);

  const width = svgWidth - horizontalBarPlotMargins.left - horizontalBarPlotMargins.right;
  const height = svgHeight - horizontalBarPlotMargins.top - horizontalBarPlotMargins.bottom;

  // const chartGroup = selector
  //   .append("g")
  //   .attr("transform", `translate(${horizontalBarPlotMargins.left},${horizontalBarPlotMargins.top})`);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(dataArray, d => d.x)])
    .range([0, width]);

  console.log('xScale')
  console.log(xScale)

  const yScale = d3.scaleBand()
    .range([height, 0])
    .domain(dataArray.map(d => d.y.toString()))
    .padding(0.1);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  console.log('xAxis')
  console.log(xAxis)

  const axes = selector.selectAll('g.axes')
  if (axes.empty()) {
    const newAxes = selector.append('g').attr('class', 'axes');
    newAxes.append("g").attr('class', 'x-axis').attr("transform", `translate(0,${height})`).call(xAxis);
    newAxes.append("g").attr('class', 'y-axis').call(yAxis);
  } else {
    console.log('updating axes')
    axes.select('g.x-axis').call(xAxis);
    axes.select('g.y-axis').call(yAxis);
  }

  const textPlot = selector.select('g.textPlot')
  if (textPlot.empty()) {
    selector.append('g').attr('class', 'textPlot')
      .append("text")
      .attr('class', 'label')
      .attr("transform", `translate(${(width / 2)},  ${2})`)
      .style("text-anchor", "middle")
      .style('font-size', '12px')
      .text(label);
  }

  let plot = selector.select('g.plot')
  if (plot.empty()) {
    plot = selector.append('g').attr('class', 'plot');
  }

  plot
    .selectAll("rect.myRect")
    .data(dataArray)
    .join(
      (enter: any) => enter
        .append("rect")
        .attr('class', 'myRect')
        .attr("x", 0)
        .attr("y", (d: any) => yScale(d.y.toString()))
        .attr("width", (d: any) => xScale(d.x))
        .attr("height", yScale.bandwidth())
        .attr("fill", () => algoColorScale(yAttributeLabel)),

      (update: any) => update
        .attr("x", 0)
        .attr("y", (d: any) => yScale(d.y.toString()))
        .attr("width", (d: any) => xScale(d.x))
        .attr("height", yScale.bandwidth()),
    )
    
    // .join("rect")
    // .attr("x", 0)
    // .attr("y", (d: any) => yScale(d.y.toString()))
    // .attr("width", (d: any) => xScale(d.x))
    // .attr("height", yScale.bandwidth())
    // .attr("fill", () => algoColorScale(yAttributeLabel));
}
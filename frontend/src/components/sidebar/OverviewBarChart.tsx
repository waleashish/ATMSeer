import { getClassifiers } from "@/utils/api";
import { OverviewBarChartProps } from "@/utils/interfaces"
import { useEffect, useRef } from "react";
import * as d3 from 'd3';

const OverviewBarChart = ({activeDatarunId}: OverviewBarChartProps) => {
  // vars
  const svgWidth = 200;
  const svgHeight = 150;
  const margin = {top: 20, right: 20, bottom: 60, left: 60};
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;  // functions

  const chartRef = useRef(null) 

  // functions
  useEffect(() => {
    const interval = setInterval(updateData, 2500);
    return () => clearInterval(interval);
  }, [activeDatarunId])

  const updateData = () => {
    getClassifiers(+activeDatarunId)
      .then((response) => {
        plotHorizontalBarChartOverview(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const plotHorizontalBarChartOverview = (completeData: any) => {
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
    const dataArray = completeData.map((d: { test_metric: any; }) => d.test_metric);

    dataArray.forEach((value: number) => {
        const index = Math.floor(value * 10); // Determine which range this value falls into
        data[index].count++; // Increment the count for that range
    });



    const selector = d3.select(chartRef.current)

    const xScale: any = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count) as any * 1.1]) // Add 10% margin
        .range([0, width]);

    const yScale: any = d3.scaleBand()
        .domain(data.map(d => d.range))
        .range([height, 0]) // Reversed range for y-axis
        .padding(0.1);

    // selector.append('g')
    //     .attr('class', 'x axis')
    //     .attr('transform', `translate(0, ${height})`) // Move x-axis to the bottom
    //     .call(d3.axisBottom(xScale));

    // selector.append('g')
    //     .attr('class', 'y axis')
    //     .call(d3.axisLeft(yScale))
    // TODO (rohan): decide on adding below code
    //     .selectAll('.tick text')
    //     .attr('transform', `translate(${0}, 0)`); // Adjust text position



    const xAxis: any = d3.axisBottom(xScale).ticks(5);
    const yAxis: any = d3.axisLeft(yScale).tickValues((yScale.domain().filter((d: any, i: any) => !(i % 2))));

    const axes = selector.selectAll('g.axes')
    if (axes.empty()) {
      const newAxes = selector.append('g').attr('class', 'axes');
      newAxes.append("g").attr('class', 'x-axis').attr("transform", `translate(0,${height})`).call(xAxis);
      newAxes.append("g").attr('class', 'y-axis').call(yAxis);

      selector.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .text('Count of test metrics in range');

      selector.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left)
        .attr('dy', '0.71em')
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .text('Range of test metrics');
    } else {
      console.log('updating axes')
      axes.select('g.x-axis').call(xAxis);
      axes.select('g.y-axis').call(yAxis);
    }

    let plot: any = selector.select('g.plot')
    if (plot.empty()) {
      plot = selector.append('g').attr('class', 'plot');
    }
    // Create bars
    plot
      .selectAll('rect.bar')
      .data(data)
      .join(
        (enter: any) => enter
          .append('rect')
          .attr('class', 'bar')
          .attr('x', 0)
          .attr('y', (d: any) => yScale(d.range))
          .attr('width', (d: any) => xScale(d.count))
          .attr('height', yScale.bandwidth())
          .attr("fill", 'steelblue'), // Changed fill color to steelblue

        (update: any) => update
          .attr('y', (d: any) => yScale(d.range))
          .attr('width', (d: any) => xScale(d.count))
          .attr('height', yScale.bandwidth())
      )

    // TODO (rohan): do we want this? Too crowded
    // selector.selectAll('.text-label')
    //     .data(data)
    //     .enter()
    //     .append('text')
    //     .attr('class', 'text-label')
    //     .attr('x', (d: any) => xScale(d.count) + 5)
    //     .attr('y', (d: any) => yScale(d.range) + yScale.bandwidth() / 2)
    //     .attr('dy', '0.35em')
    //     .text((d: any) => d.count);

}


  // render
  return (
    <div id='overviewBarChart'>
      <svg
        width={svgWidth}
        height={svgHeight}
      >
        <g className="main-plot" transform={`translate(${margin.left}, ${margin.top})`} ref={chartRef} ></g>
      </svg>
    </div>
  )
}

export default OverviewBarChart
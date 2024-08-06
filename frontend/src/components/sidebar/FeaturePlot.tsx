import { FeaturePlotProps } from '@/utils/interfaces'
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TOOLTIP } from '@/utils/constants';

const FeaturePlot = ({data, column}: FeaturePlotProps) => {
  //vars
  const chartRef = useRef(null);
  const svgWidth = 200;
  const svgHeight = 200;
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  // functions
  useEffect(() => {
    createChart();
  }, [data, column]);

  const createChart = () => {

    // Calculate intervals
    const classData = data.map((row: any) => row['class']);
    let columnData = data.map((row: any) => row[column]);
    columnData = columnData.map(Number).filter(Number.isFinite);
    columnData = columnData.map((d: any) => parseFloat(d.toFixed(2)));
    const uniqueClassValues: any = new Set(data.map((row: any) => row['class']));
    const uniqueClassCount: any = uniqueClassValues.size;

    // If columnData is empty, return early
    if (columnData.length === 0) {
        console.log('columnData is empty. Returning early.');
        return;
    }

    const minV1: any = d3.min(columnData);
    const maxV1: any = d3.max(columnData);
    const intervalCount = 10;
    const intervalSize = parseFloat(((maxV1 - minV1) / intervalCount).toFixed(2));

    // Prepare data for intervals and categories
    const intervals: any = [];
    for (let i = 0; i < intervalCount; i++) {
        const intervalValue = minV1 + i * intervalSize;
        if (intervalValue !== undefined) {
            intervals.push({
                interval: intervalValue,
                counts: new Map(),
            });
        }
    }

    columnData.forEach((d: any, index: number) => {
        const intervalIndex = Math.floor((d - minV1) / intervalSize);
        const interval = intervals[intervalIndex];
        if (interval && !interval.counts.has(classData[index])) {
            interval.counts.set(classData[index], 1);
        } else if (interval) {
            interval.counts.set(classData[index], interval.counts.get(classData[index]) + 1);
        }
    });

    // D3 code to create the bar plot
    const svg = d3.select(chartRef.current).selectAll('g.plot');
    svg.selectAll('*').remove();

    const xScale: any = d3.scaleBand()
        .domain(intervals.map((d: { interval: any; }) => d.interval))
        .range([0, width])
        .padding(0.1);

    let overallMaxCount = 0;
    let overallMinCount = Infinity;
    intervals.forEach((interval: any) => {
        interval.counts.forEach((count: number) => {
            overallMaxCount = Math.max(overallMaxCount, count);
            overallMinCount = Math.min(overallMinCount, count);
        });
    });

    // Update y-axis scale with overall maximum and minimum values
    const yScale: any = d3.scaleLinear()
        .domain([overallMinCount, Math.round(overallMaxCount * 1.05)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text") // Rotate x-axis labels if needed for better readability
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em");

    svg.append("g")
        .call(d3.axisLeft(yScale));

    const colorScale: any = d3.scaleOrdinal()
        .domain(uniqueClassValues)
        .range(d3.schemeCategory10);


    // D3 code to create the bar plot
    intervals.forEach((interval: any, intervalIndex: number) => {
        const barWidth = xScale.bandwidth() / interval.counts.size;
        let xOffset = 0;

        interval.counts.forEach((count: any, category: any) => {
            svg.append("rect")
                .attr("x", xScale(interval.interval) + xOffset)
                .attr("y", yScale(count))
                .attr("width", barWidth)
                .attr("height", height - yScale(count))
                .attr("fill", colorScale(category))
                .on('mouseover', function (event, d) {
                    TOOLTIP.style('visibility', 'visible');
                })
                .on('mousemove', function (event, d) {
                    TOOLTIP
                        .style('top', event.pageY - 10 + 'px')
                        .style('left', event.pageX + 10 + 'px')
                    TOOLTIP.html(`class ${category} : ${count}
                        <br>
                        <div style="background-color: ${colorScale(category)}; ">
                        &nbsp;&nbsp;
                        ${(minV1 + intervalIndex * intervalSize).toFixed(2)} ~ ${(minV1 + (1 + intervalIndex) * intervalSize).toFixed(2)}</div>`);
                })
                .on('mouseout', function (event, d) {
                    TOOLTIP.style('visibility', 'hidden');
                });

            xOffset += barWidth;
        });
    });
  }


  // render
  return (
    <div>
      <h3>{column}</h3>
      <svg
        width={svgWidth}
        height={svgHeight}
        ref={chartRef}>
          <g transform={`translate(${margin.left}, ${margin.top})`} className='plot' />
      </svg>
    </div>
  )
}

export default FeaturePlot
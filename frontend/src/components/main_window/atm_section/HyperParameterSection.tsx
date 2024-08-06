import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useEffect, useRef, useState } from "react";
import { HyperParametersSectionProps } from "@/utils/interfaces"
import * as d3 from "d3";
import { AREA_GRAPH_SIZE_CONSTANTS, algoColorScale } from "@/utils/constants";
import { createHyperPartitionsChartData, kernelDensityEstimator, kernelEpanechnikov, wrangleData } from "@/utils/helper";
import { getClassifiers, getHyperpartitions } from "@/utils/api";

const HyperParameterSection = (
  { activeDatarunId, algorithm }: HyperParametersSectionProps
) => {
  // vars
  const [keysList, setKeysList] = useState<any>([]);
  const scatterSVGWidth = 260;
  const scatterSVGHeight = 200;

  const densitySVGWidth = 260;
  const densitySVGHeight = 100;

  const scatterPlotMargin = {top: 10, right: 30, bottom: 2, left: 40};
  const densityPlotMargin = {top: 5, right: 30, bottom: 30, left: 40};


  // functions
  useEffect(() => {
    const interval = setInterval(getHyperPartitionPlottingData, 2500);
    return () => clearInterval(interval);
  }, [activeDatarunId, algorithm])

  const drawScatterPlot = (data: any, key_: string) => {

    // Set dimensions for the plots
    const width = scatterSVGWidth - scatterPlotMargin.left - scatterPlotMargin.right;
    const height = scatterSVGHeight - scatterPlotMargin.top - scatterPlotMargin.bottom;

    // Create an SVG container for the scatter plot
    const svg = d3.select(`svg.hyperparameter-scatter-chart.${key_}`)
    console.log('svg')
    console.log(svg)
    let selector: any = svg.selectAll('g.scatterPlot');


    // Define scales
    const xScaleDomain = d3.extent(data, (d: any) => d.x) as unknown as [number, number];
    const yScaleDomain = d3.extent(data, (d: any) => d.y) as unknown as [number, number];

    const xScale = d3.scaleLinear()
        .domain(xScaleDomain)
        .range([0, width]);
    const yScale = d3.scaleLinear()
        .domain(yScaleDomain)
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale).tickFormat(() => "").tickSize(0);
    const yAxis = d3.axisLeft(yScale).ticks(5);
  
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

    selector.selectAll("circle.scatterPoints")
        .data(data)
        .join(
            (enter: any) => enter.append("circle")
                .attr("cx", (d: any) => {
                    return xScale(d.x);
                })
                .attr("cy", (d: any) => {
                    return yScale(d.y);
                })
                .attr("r", 3) // Radius of the circle
                .style("fill", algoColorScale(algorithm)) // Color of the circles(d) => d.color
                .attr("class", "scatterPoints"),

            (update: any) => update
                .attr("cx", (d: any) => {
                    return xScale(d.x);
                })
                .attr("cy", (d: any) => {
                    return yScale(d.y);
                })

        );
  }

  const drawDensityPlot = (data: any, key_: string) => {

    console.log('data')
    console.log(data)

    console.log('key_')
    console.log(key_)

      // Set dimensions for the plots
      const width = densitySVGWidth - densityPlotMargin.left - densityPlotMargin.right;
      const height = densitySVGHeight - densityPlotMargin.top - densityPlotMargin.bottom;

      // Create an SVG container for the density graph
      const svgDensity = d3.select(`svg.hyperparameter-density-chart.${key_}`).selectAll('g.densityPlot');

      const xScaleDomain = d3.extent(data, (d: any) => d.x) as unknown as [number, number];
      const xScale = d3.scaleLinear()
          .domain(xScaleDomain)
          .range([0, width]);

      const yScale = d3.scaleLinear()
          .domain([0, AREA_GRAPH_SIZE_CONSTANTS[algorithm]["areaHeight"]])  // don't know why this is set to this areaHeight
          .range([height, 0]);

      const xAxis = d3.axisBottom(xScale).ticks(5);
    
      const axes: any = svgDensity.selectAll('g.axes')
      if (axes.empty()) {
        const newAxes = svgDensity.append('g').attr('class', 'axes');
        newAxes.append("g").attr('class', 'x-axis').attr("transform", `translate(0,${height})`).call(xAxis);
      } else {
        console.log('updating axes')
        axes.select('g.x-axis').call(xAxis);
      }

      const label = [key_]

      svgDensity
        .selectAll('text.label')
        .data(label)
        .enter()
          .append("text")
          .attr('class', 'label')
          .attr("transform", `translate(${(width / 2)},  ${densityPlotMargin.top + 5})`)
          .style("text-anchor", "middle")
          .style('font-size', '12px')
          .text(key_);


      // Compute kernel density estimation
      let kde = kernelDensityEstimator(kernelEpanechnikov(0.1), xScale.ticks(40));
      let density = kde(data.map((d: any) => d.x));

      density.unshift([density[0][0], 0]);
      density.push([density[density.length - 1][0], 0]);

      const curveLine = d3.line()
              .curve(d3.curveBasis)
              .x(function (d) {
                  return xScale(d[0]);
              })
              .y(function (d) {
                  return yScale(d[1]);
              })
      // Plot the area
      svgDensity
        .selectAll('path.mypath')
        .data([density])
        .join(
          (enter: any) => enter
            .append("path")
            .attr("class", "mypath")
            .attr("fill", AREA_GRAPH_SIZE_CONSTANTS[algorithm]["color"])
            .attr("opacity", ".8")
            .attr("stroke", AREA_GRAPH_SIZE_CONSTANTS[algorithm]["color"])
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr('d', curveLine),

          (update: any) => update
            .attr('d', curveLine)

        )
  }

  const getHyperPartitionPlottingData = (): any => {
    if (!activeDatarunId) return;

    const classifierData = getClassifiers(+activeDatarunId).then((data) => { return wrangleData(data) });
    const hyperPartitionData = getHyperpartitions(+activeDatarunId)

    Promise.all([classifierData, hyperPartitionData]).then(([classifiers, hyperpartitions]) => {
      let ret = createHyperPartitionsChartData(classifiers, hyperpartitions, algorithm);
      console.log('hyperPartitionData')
      console.log(ret)
      setKeysList(ret.keys)

      // setDataKeys(ret.keys);
      // setHyperParametersChartsData(ret.hyperParametersChartData);

      ret.keys.forEach((key_: any) => {
        drawScatterPlot(ret.hyperParametersChartData[key_], key_);
        drawDensityPlot(ret.hyperParametersChartData[key_], key_);
      })

    });
  };


  // render
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>HyperParameters</AccordionTrigger>
        <AccordionContent>
          {/* graphs of hyperparamters */}
          <div className="flex flex-wrap">
          {
            keysList.map((key: any) => {
              return (
                <div className="flex flex-col">
                  <svg
                    className={`hyperparameter-scatter-chart ${key}`}
                    width={scatterSVGWidth}
                    height={scatterSVGHeight}
                    role="img"
                  ><g className="scatterPlot" transform={`translate(${scatterPlotMargin.left},${scatterPlotMargin.top})`}></g></svg>

                  <svg
                    className={`hyperparameter-density-chart ${key}`}
                    width={densitySVGWidth}
                    height={densitySVGHeight}
                    role="img"
                  ><g className="densityPlot" transform={`translate(${densityPlotMargin.left},${densityPlotMargin.top})`}></g></svg>
                </div>
              )
            })

          }

          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default HyperParameterSection
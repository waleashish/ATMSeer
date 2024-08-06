import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { getClassifiers } from "@/utils/api";
import { aggregateTestMetricCountByAlgorithm, wrangleData } from "@/utils/helper";
import { AlgorithmsSectionsProps } from "@/utils/interfaces";
// import AlgorithmChart from "@/components/main_window/atm_section/AlgorithmChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


// (rohan) Merging Algorithm Charts
// imports
// import { useEffect, useRef } from 'react'
import { AlgorithmChartProps } from '@/utils/interfaces'
// import * as d3 from 'd3';
import { plotHorizontalBarChart } from '@/utils/plot';
import { horizontalBarPlotMargins } from '@/utils/constants';


const AlgorithmsSections = ({ activeDatarunId, setAlgorithmSelected }: AlgorithmsSectionsProps) => {
  const [testMetricByAlgoFreqMapData, setTestMetricByAlgoFreqMapData] = useState<any>(undefined);
  const [methodsList, setMethodsList] = useState<any>([]);
  const vizRef = useRef(null);

  // algorithm chart vars
  // const vizRef = useRef(null);
  const svgWidth = 230;
  const svgHeight = 200;
  // let drawingSpace: any;
  // ===

  useEffect(() => {
    const interval = setInterval(updateData, 2500);
    return () => clearInterval(interval);
  }, [activeDatarunId])

  const updateData = () => {
    console.log("Plotting algorithms bar chart");
    if (!activeDatarunId) return;
    const dataPromise = getClassifiers(+activeDatarunId, "complete")
      .then((data) => wrangleData(data))
      .catch((err) => console.error(err));

    dataPromise.then((data): any => {
      const testMetricByAlgoFreqMap = aggregateTestMetricCountByAlgorithm(data);
      console.log('testMetricByAlgoFreqMap')
      console.log(testMetricByAlgoFreqMap);
      setTestMetricByAlgoFreqMapData(testMetricByAlgoFreqMap);
      let newMethodsList = Object.keys(testMetricByAlgoFreqMap);
      setMethodsList(newMethodsList);
      newMethodsList.forEach((algo: any) => {
        plotChart(testMetricByAlgoFreqMap[algo], algo);
      })
    });
  };

  const plotChart = (data: any, algorithm: string) => {
    if (!data) return;
    const svg = d3
      .select(vizRef.current)
      .select(`svg.${algorithm}`);

    let drawingSpace: any = svg
      .selectAll('g');
    
    console.log('drawingSpace')
    console.log(drawingSpace)
    console.log(drawingSpace.empty())

    if (drawingSpace.empty()) {
      drawingSpace = svg 
        .append("g")
        .attr("transform", `translate(${horizontalBarPlotMargins.left},${horizontalBarPlotMargins.top})`)
        .attr("class", "plot");
    }
    drawingSpace.call(plotHorizontalBarChart, data, "", algorithm, svgWidth, svgHeight, algorithm);
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Algorithms</AccordionTrigger>
        <AccordionContent>
          <div id="algorithms-bar-chart" ref={vizRef} style={{ margin: "10px 0" }}>
            <div className="flex flex-wrap">
              {
                methodsList.map((algo: any, i: number) => {
                  return (
                      <svg
                        className={`algorithm-bar-chart ${algo}`}
                        width={svgWidth}
                        height={svgHeight}
                        role="img"
                        onClick={() => setAlgorithmSelected(algo)}
                        style={{cursor: "pointer"}}
                      ></svg>
                  )
                })
              }
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};


export default AlgorithmsSections;
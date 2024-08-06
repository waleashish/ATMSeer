import { getClassifiers } from "@/utils/api";
import { END_TIME, TEST_METRIC, verticalBarPlotMargins } from "@/utils/constants";
import { wrangleData } from "@/utils/helper"
import { plotVerticalBarChart } from "@/utils/plot";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { TrialsSectionProps } from "@/utils/interfaces";

const TrialsSection = ({ activeDatarunId }: TrialsSectionProps) => {
  // vars
  const vizRef = useRef(null);
  const svgWidth = 900;
  const svgHeight = 250;
  let drawingSpace: any;
  
  // functions
  useEffect(() => {
    d3.select(vizRef.current).selectAll("*").remove();

    drawingSpace = d3
      .select(vizRef.current)
      .append("g")
      .attr("transform", `translate(${verticalBarPlotMargins.left},${verticalBarPlotMargins.top})`);

      const interval = setInterval(plotTrialsBarChart, 2500);
      return () => clearInterval(interval);
  }, [activeDatarunId])
  
  const plotTrialsBarChart = (orderByTime: boolean = true): any => {
    console.log("Plotting trials bar chart");
    console.log(activeDatarunId);
    if (!activeDatarunId) return;
    const dataPromise = getClassifiers(+activeDatarunId, "complete")
    .then((data) => wrangleData(data))
    .catch((err) => console.error(err));
    
    dataPromise.then((data): any => {
      if (orderByTime) data.sort((a: any, b: any) => a[END_TIME] - b[END_TIME]);
      else data.sort((a: any, b: any) => b[TEST_METRIC] - a[TEST_METRIC]);
      
      //d3.select(vizRef.current).call(plotVerticalBarChart, data, TEST_METRIC, true, 1, svgWidth, svgHeight, true, false);
      if (drawingSpace) {
        drawingSpace.call(plotVerticalBarChart, data, TEST_METRIC, true, null, svgWidth, svgHeight, true, true, 'Number of Classifiers');
      }
      
    });
  };
  
  
  // setters
  
  // render
  return (
    <>
    <h2>Trials Section</h2>
    <div id="trials-section-viz">
    <svg
    className="bar-chart-container"
    width={svgWidth}
    height={svgHeight}
    role="img"
    ref={vizRef}
    ></svg>
    </div>
    </>
  )
};

export default TrialsSection;
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getClassifiers, getHyperpartitions } from "@/utils/api";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { getHyperPartitionStringToDetailsMap, wrangleData } from "@/utils/helper";
import { CV_METRIC, CV_VALUES, METHOD, verticalBarPlotMargins } from "@/utils/constants";
import { HyperPartitionSectionProps } from "@/utils/interfaces";
import { plotVerticalBarChart } from "@/utils/plot";


const HyperPartitionSection = ({
  activeDatarunId,
  algorithm,
}: HyperPartitionSectionProps) => {

  const [hyperPartitionStringToDetailsMap, setHyperPartitionStringToDetailsMap] = useState<any>(undefined);
  const [hyperPartitionStringList, setHyperPartitionStringList] = useState<any>([]);
  const vizRef = useRef(null);

  const svgWidth = 260;
  const svgHeight = 200;

  useEffect(() => {
    // d3.select(vizRef.current).selectAll("*").remove();
    const interval = setInterval(getHyperPartitionPlottingData, 2500);
    return () => clearInterval(interval);
  }, [activeDatarunId, algorithm])

  const getHyperPartitionPlottingData = (): any => {
    if (!activeDatarunId) return;

    const classifierData = getClassifiers(+activeDatarunId).then((data) => { return wrangleData(data) });
    const hyperPartitionData = getHyperpartitions(+activeDatarunId)

    Promise.all([classifierData, hyperPartitionData]).then(([classifiers, hyperpartitions]) => {
      console.log('classifiers')
      console.log(classifiers);

      hyperpartitions = hyperpartitions.filter((d: any) => d[METHOD] === algorithm)
      console.log('hyperpartitions')
      console.log(hyperpartitions);

      let hyperPartitionStringToDetailsMap_ = getHyperPartitionStringToDetailsMap(classifiers, hyperpartitions);
      console.log('hyperPartitionStringToDetailsMap_')
      console.log(hyperPartitionStringToDetailsMap_);

      const newHyperPartitionStringList = Object.keys(hyperPartitionStringToDetailsMap_);
      if ((newHyperPartitionStringList.length - hyperPartitionStringList.length) !== 0){
        setHyperPartitionStringList(newHyperPartitionStringList);
      }
      setHyperPartitionStringToDetailsMap(hyperPartitionStringToDetailsMap_);

      newHyperPartitionStringList.forEach((hyperPartitionString: any) => {
        const svg = d3.select(`svg.${hyperPartitionString}`)
        let drawingSpace: any = svg
          .selectAll('g');
        
        console.log('drawingSpace')
        console.log(drawingSpace)
        console.log(drawingSpace.empty())
    
        if (drawingSpace.empty()) {
          drawingSpace = svg 
            .append("g")
            .attr("transform", `translate(${verticalBarPlotMargins.left},${verticalBarPlotMargins.top})`)
            .attr("class", "plot");
        }

        const data = hyperPartitionStringToDetailsMap_[hyperPartitionString]
        if (!data) return;
        drawingSpace.call(plotVerticalBarChart, data[CV_VALUES], CV_METRIC, false, null, svgWidth, svgHeight, true, false, hyperPartitionString)
      })
    });


  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>HyperPartition</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap">
          {hyperPartitionStringList.map((hyperPartitionString: any, i: number) => {
            return (
              <svg
                className={`hyperpartition-bar-chart-by-algo-section ${hyperPartitionString}`}
                width={svgWidth}
                height={svgHeight}
                role="img"
              ></svg>
              // <p id={`p-${i}`}>{`Hyperpartition String: ${hyperPartitionString}`}</p>
            )
          })}

          </div>
          {/* graphs of hyperpartition */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default HyperPartitionSection
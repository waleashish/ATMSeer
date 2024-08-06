import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useRef, useEffect} from "react";
import { ExplainabilitySectionProps } from "@/utils/interfaces";
import * as d3 from "d3";
import { explainableAPI } from "@/utils/api";

const jsonData: any = {
  "knn": {
      "base_values": [
          [
              0.3250000000000002,
              0.31000000000000016,
              0.3650000000000002
          ],
          [
              0.3250000000000002,
              0.31000000000000016,
              0.3650000000000002
          ],
          [
              0.3250000000000002,
              0.31000000000000016,
              0.3650000000000002
          ],
          [
              0.3250000000000002,
              0.31000000000000016,
              0.3650000000000002
          ]
      ],
      "input_value": [
          5.8,
          2.8,
          5.1,
          2.4
      ],
      "shap_values": [
          [
              -0.0012499999999999749,
              -0.013055555555555633,
              0.014305555555555792
          ],
          [
              -0.008750000000000023,
              -0.028611111111111167,
              0.03736111111111094
          ],
          [
              -0.2979166666666668,
              0.012222222222222233,
              0.2856944444444442
          ],
          [
              -0.017083333333333395,
              -0.2805555555555556,
              0.29763888888888884
          ]
      ]
  },
  "logreg": {
      "base_values": [
          [
              0.3250091180626248,
              0.30832985035106314,
              0.36666103158631197
          ],
          [
              0.3250091180626248,
              0.30832985035106314,
              0.36666103158631197
          ],
          [
              0.3250091180626248,
              0.30832985035106314,
              0.36666103158631197
          ],
          [
              0.3250091180626248,
              0.30832985035106314,
              0.36666103158631197
          ]
      ],
      "input_value": [
          5.8,
          2.8,
          5.1,
          2.4
      ],
      "shap_values": [
          [
              -0.006744337817398049,
              -0.00153591350004551,
              0.008280251317443754
          ],
          [
              -0.005721702346040551,
              0.003818116025318572,
              0.0019035863207219296
          ],
          [
              -0.3047898218606786,
              0.05179503674328188,
              0.2529947851173968
          ],
          [
              -0.007639590276800889,
              -0.3031596770380058,
              0.31079926731480667
          ]
      ]
  },
  "svm": {
      "base_values": [
          [
              0.32188880843349554,
              0.3049036340075818,
              0.37320755755892265
          ],
          [
              0.32188880843349554,
              0.3049036340075818,
              0.37320755755892265
          ],
          [
              0.32188880843349554,
              0.3049036340075818,
              0.37320755755892265
          ],
          [
              0.32188880843349554,
              0.3049036340075818,
              0.37320755755892265
          ]
      ],
      "input_value": [
          5.8,
          2.8,
          5.1,
          2.4
      ],
      "shap_values": [
          [
              -0.0007998751633788398,
              -0.01626465122032904,
              0.01706452638370776
          ],
          [
              -0.009699761082721244,
              0.002483240643774255,
              0.007216520438946766
          ],
          [
              -0.2647792497199123,
              0.0055051631081622626,
              0.2592740866117501
          ],
          [
              -0.03527631859326874,
              -0.2896226313846097,
              0.3248989499778786
          ]
      ]
  }
}

const ExplainabilitySection = ({activeDatarunId, algorithm}: ExplainabilitySectionProps) => {
  const svgWidth = 230;
  const svgHeight = 200;
  const vizRef = useRef(null);

  console.log('activeDatarunId') 
  console.log(activeDatarunId)

  const [nClasses, setNClasses] = useState(0)
  const [data, setData] = useState<any>()

  useEffect(() => {
    if (algorithm) {
      wrangleShapData(jsonData[algorithm])
    }
  }, [])

  useEffect(() => {
    if (data) {
      drawAllPlots()
    }
  }, [data])

  const wrangleShapData = (data: any) => {
    const baseValues = data.base_values[0]
    const nClasses = baseValues.length
    setNClasses(nClasses)

    const inputValues = data.input_value
    const nFeatures = inputValues.length

    const shapValues = data.shap_values

    let ret: any = {}
    for (let i = 0; i < nClasses; i++) {
      ret[i] = []
      let startValue = baseValues[i]
      for (let j = 0; j < nFeatures; j++) {
        let tmp = {
          feature: j,
          value: inputValues[j],
          shapValue: shapValues[j][i],
          startValue: startValue,
          endValue: startValue + shapValues[j][i],
          class: (shapValues[j][i] > 0 ? 'positive' : 'negative')
        }
        startValue = tmp.endValue
        ret[i].push(tmp)
      }
    }

    console.log('ret')
    console.log(ret)
    setData(ret)
    return ret
  }

  const drawAllPlots = () => {
    for(let i = 0; i < nClasses; i++) {
      plotShapValues(i)
    }
  }

  const plotShapValues = (i: number) => {
    const plottingData = data[i]  // TODO (rohan): change this to plot all classes

    const margin = { top: 20, right: 20, bottom: 50, left: 50 }
    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom

    const svg = d3.select(`svg.explainability-waterfall-chart#svg-${i}`)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // svg.selectAll('*').remove()

    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width])

    const yScale: any = d3.scaleBand()
      .domain(plottingData.map((d: any) => d.feature))
      .range([height,0 ])
      .padding(0.5)

    const colorScale = d3.scaleOrdinal()
      .domain(['positive', 'negative'])
      .range(['#ff7f0e', '#1f77b4'])

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale).tickFormat((d: any) => `Feat. ${d}`)

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
    
    svg.append("g")
      .call(yAxis)

    console.log('plottingData')
    console.log(plottingData)

    const drawingSpace = svg.append("g")
    drawingSpace.selectAll("rect.shap-bar")
      .data(plottingData)
      .join(
        (enter: any) => enter
          .append("rect")
          .attr('class', 'shap-bar')
          .attr('x', (d: any) => xScale(Math.min(d.startValue, d.endValue)))
          .attr('y', (d: any) => yScale(d.feature))
          .attr('width', (d: any) => xScale(Math.abs(d.shapValue)))
          .attr('height', yScale.bandwidth())
          .style('fill', (d: any) => colorScale(d.class))


      )

    drawingSpace.selectAll("text.feature")
      .data(plottingData)
      .join(
        (enter: any) => enter
          .append('text')
          .text((d: any) => d.shapValue.toFixed(2))
          .attr('x', (d: any) => xScale(Math.min(d.startValue, d.endValue)) + xScale(Math.abs(d.shapValue)) / 2)
          .attr('y', (d: any) => yScale(d.feature) + yScale.bandwidth()/2)
          .attr('dy', '0.35em')
          .style('font-size', '10px')
          .style('text-anchor', 'middle')
      )

    // Expected Value
    svg.append('text')
      .attr('x', xScale(plottingData[0].startValue))
      .attr('y', height + margin.bottom - 30)
      .attr('dy', '1em')
      .text(`E(x): ${plottingData[0].startValue.toFixed(2)}`)
      .style('font-size', '12px')

    svg.append('rect')
          .attr('class', 'shap-bar')
          .attr('x', xScale(plottingData[0].startValue))
          .attr('y', height - yScale.bandwidth()/2)
          .attr('width', '1px')
          .attr('height', yScale.bandwidth())
          .style('fill', 'black')

    svg
      .append('text')
      .attr('x', width/2)
      .attr('y', -margin.top/2)
      .attr('dy', '1em')
      .text(`Class ${i} Shap Values`)
      .style('font-size', '13px')
      .style('text-anchor', 'middle')
    }


  const svgs = []
  for (let i = 0; i < nClasses; i++) {
    svgs.push(
      <svg
      className={`explainability-waterfall-chart ${algorithm}`}
      width={svgWidth}
      height={svgHeight}
      role="img"
      // ref={vizRef}
      id={`svg-${i}`}
      ></svg> 
    )
  }


  return (
    <div className="flex flex-wrap">{svgs}</div>
  )

}

export default ExplainabilitySection
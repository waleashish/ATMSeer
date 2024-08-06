import { OverviewTabProps } from "@/utils/interfaces"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getClassifiers } from "@/utils/api"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import ClassifierAccordion from "./ClassifierAccordion"
import OverviewBarChart from "./OverviewBarChart"
import { TRANSITION_DURATION } from "@/utils/constants"

const OverviewTab = ({activeDatarunId}: OverviewTabProps) => {
  // vars
  const classiferRef: any = useRef(null)
  const [nClassifiers, setNClassifiers] = useState(5)
  const [completeData, setCompleteData] = useState<any>([{}])
  const [classifierInfo, setClassifierInfo] = useState<any>([{}])

  // functions
  useEffect(() => {
    const interval = setInterval(pollCompleteData, TRANSITION_DURATION)
    return () => clearInterval(interval)
  }, [activeDatarunId])

  const pollCompleteData = () => {
    getClassifiers(+activeDatarunId)
      .then((response) => {
        console.log('raw response')
        console.log(response)
        response && setCompleteData(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    updateClassifierInfo()
  }, [nClassifiers, completeData])

  const updateClassifierInfo = () => {
    const data = completeData;
    data.sort((a: any, b: any) => b.test_metric - a.test_metric)
    setClassifierInfo(data.slice(0, nClassifiers))
  }



  // render
  return (
    <div>
      {/* <div>Metrics</div>
      <div>Best Classifier</div>
      <div>Total Classifiers</div>
      <div>Algorithms</div>
      <div>HyperPartitions</div>
      <div>Performance</div> */}
      <OverviewBarChart activeDatarunId={activeDatarunId} />
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="nClassifier" className="text-xs">Show Top N Classifiers</Label>
        <Input ref={classiferRef} id="nClassifier" type="number" onChange={() => setNClassifiers(classiferRef.current?.value)} defaultValue={5}/>
      </div>
      <div id="barPlot"></div>
      <div id="bar-chart"></div>
      <div id="topClassifiers" className="container text-sm">
        <Accordion type="single" collapsible className="w-full">
          {classifierInfo.map((classifier: any, index: number) => (
            <AccordionItem value={`item-${index}`}>
              <ClassifierAccordion key={index} classifier={classifier} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default OverviewTab
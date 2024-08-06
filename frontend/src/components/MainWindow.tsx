import TrialsSection from './main_window/atm_section/TrialsSection'
import AlgorithmsSections from './main_window/atm_section/AlgorithmsSections'
import HyperPartitionSection from './main_window/atm_section/HyperPartitionSection'
import HyperParameterSection from './main_window/atm_section/HyperParameterSection'
import { MainWindowProps } from '@/utils/interfaces'
import { useState } from 'react'
import ExplainabilitySection from './main_window/atm_section/ExplainabilitySection'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MainWindow = (props: MainWindowProps) => {
  // vars
  const [algorithmSelected, setAlgorithmSelected] = useState<string>("")

  // functions

  // setters

  //render
  return (
    <div>
      <TrialsSection key={props.activeDatarunId} activeDatarunId={props.activeDatarunId} ></TrialsSection>
      <AlgorithmsSections activeDatarunId={props.activeDatarunId} setAlgorithmSelected={setAlgorithmSelected} ></AlgorithmsSections>
      <HyperPartitionSection
        key={`hyperpartition-section-${algorithmSelected}-${props.activeDatarunId}`}
        activeDatarunId={props.activeDatarunId} algorithm={algorithmSelected}
      ></HyperPartitionSection>
      <HyperParameterSection
        key={`hyperparameter-section-${algorithmSelected}-${props.activeDatarunId}`}
        activeDatarunId={props.activeDatarunId} algorithm={algorithmSelected}></HyperParameterSection>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Explainability</AccordionTrigger>
          <AccordionContent >
            <ExplainabilitySection
              key={`explainability-section-${algorithmSelected}-${props.activeDatarunId}`}
              activeDatarunId={props.activeDatarunId} algorithm={algorithmSelected}></ExplainabilitySection>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default MainWindow
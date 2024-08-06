import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { ClassifierAccordionProps } from "@/utils/interfaces"

const ClassifierAccordion = ({classifier}: ClassifierAccordionProps) => {
  return (
    <>
      <AccordionTrigger className="text-xs">{`${classifier.method}: ${classifier?.cv_metric?.toFixed(2)} +- ${classifier?.cv_metric_std?.toFixed(2)}`}</AccordionTrigger>
      <AccordionContent>

      <Table className="w-10">
        <TableBody>
          {
            classifier.hyperparameters && Object.entries(classifier.hyperparameters).map((d:any) => {
              let v = d[1];
              if (typeof v === 'number') v = v?.toFixed(2);

              return (
                    <TableRow>
                      <TableCell className="text-xs text-right p-1 w-5">{d[0]}</TableCell>
                      <TableCell className="text-xs text-left  p-1 w-5">{v}</TableCell>
                    </TableRow>
              );
            })
          }
        </TableBody>
      </Table>

      </AccordionContent>
    </>
  )
}

export default ClassifierAccordion
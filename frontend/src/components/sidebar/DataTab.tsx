import { useEffect, useState } from 'react'
import DataTabSummary from '@/components/sidebar/DataTabSummary'
import { getDatasetFile } from '@/utils/api'
import { DataTabProps } from '@/utils/interfaces'
import * as d3 from 'd3'
import FeaturePlot from '@/components/sidebar/FeaturePlot'

const DataTab = ({activeDatasetId}: DataTabProps) => {
  // vars
  const [numRows, setNumRows] = useState(0)
  const [numColumns, setNumColumns] = useState(0)
  const [classSummary, setClassSummary] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [data, setData] = useState<any>([])

  // functions
  useEffect(() => {
    getDatasetFile(+activeDatasetId, true)
      .then((response) => {
        console.log('raw response')
        console.log(response)
        return d3.csvParse(response)
      })
      .then((data) => {
        console.log('d3 loaded csv data')
        console.log(data)

        const columns = Object.keys(data[0]).filter(col => col !== "class");

        setColumns(columns)
        setData(data)

        // Create summary
        setNumRows(data.length)
        setNumColumns(columns.length)
        setClassSummary(getClassSummary(data))
      })
      .catch((error) => {
        console.error(error)
      })
  }, [activeDatasetId])

  const getClassSummary = (data: any) => {
    const uniqueClassValues: any = new Set(data.map((row: any) => row['class']));
    const colorScale = d3.scaleOrdinal()
        .domain(uniqueClassValues)
        .range(d3.schemeCategory10);
    const classCounts: any = {};
    data.forEach((row: { class: any }) => {
        const className: any = row.class;
        if (classCounts[className]) {
            classCounts[className]++;
        } else {
            classCounts[className] = 1;
        }
    });

    const classSummary = Object.keys(classCounts).map(className => {
        const count = classCounts[className];
        const color = colorScale(className) || "#000000"; // Get color based on class name
        const colorIcon = `<span style="display: inline-block; width: 20px; height: 20px; background-color: ${color}; margin-right: 5px;"></span> ${className}: ${count}`;

        return {className, count, color, colorIcon};
    });

    return classSummary;
}


  // render
  return (
    <div>
      <h2>Data Tab</h2>
      <DataTabSummary
        numRows={numRows}
        numColumns={numColumns}
        classSummary={classSummary}
      />
      {columns.length > 0 && columns.map((col: any, index: number) => (
        <FeaturePlot key={`heading_${index}`} data={data} column={col} />
      ))}
    </div>
  )
}

export default DataTab
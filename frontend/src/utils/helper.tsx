import * as d3 from "d3";
import { CV_METRIC, END_TIME, START_TIME, TEST_METRIC, METHOD, ID, HYPERPARTITION_ID, CV_VALUES, HYPERPARTITION_STRING, TUNABLES, AREA_GRAPH_SIZE_CONSTANTS, HYPERPARAMETERS } from "./constants";

export const wrangleData = (data: any) => {
  return data.map((d: any) => {
    d[TEST_METRIC] = parseFloat(parseFloat(d[TEST_METRIC]).toFixed(1));
    d[CV_METRIC] = parseFloat(parseFloat(d[CV_METRIC]).toFixed(3));
    d[START_TIME] = new Date(d[START_TIME]);
    d[END_TIME] = new Date(d[END_TIME]);

    return d;
  });
};

export const aggregateTestMetricCountByAlgorithm = (data: any) => {
  let testMetricByAlgoFreqMap: any = {};
  data.forEach((d: any) => {
    if (d[METHOD] in testMetricByAlgoFreqMap) {
      if (d[TEST_METRIC] in testMetricByAlgoFreqMap[d[METHOD]]) {
        testMetricByAlgoFreqMap[d[METHOD]][d[TEST_METRIC]] += 1;
      } else {
        testMetricByAlgoFreqMap[d[METHOD]][d[TEST_METRIC]] = 1;
      }
    } else {
      testMetricByAlgoFreqMap[d[METHOD]] = {};
      for (const element of [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]) {
        testMetricByAlgoFreqMap[d[METHOD]][element] = 0;
      }
      testMetricByAlgoFreqMap[d[METHOD]][d[TEST_METRIC]] = 1;
    }
  });
  return testMetricByAlgoFreqMap;
};

export const getHyperPartitionStringToDetailsMap = (data: any, hyperPartitionData: any) => {
  let hyperPartitionStringToDetailsMap: any = {}
  let hyperPartitionIdToCVMap: any = {}
  hyperPartitionData.forEach((d: any) => {
      hyperPartitionStringToDetailsMap[d[HYPERPARTITION_STRING]] = {id: d[ID]}
  })
  data.forEach((d: any) => {
      if (d[HYPERPARTITION_ID] in hyperPartitionIdToCVMap) {
          hyperPartitionIdToCVMap[d[HYPERPARTITION_ID]].push({cv_metric: d[CV_METRIC], id: d[ID], method: d[METHOD]})
      } else {
          hyperPartitionIdToCVMap[d[HYPERPARTITION_ID]] = [{cv_metric: d[CV_METRIC], id: d[ID], method: d[METHOD]}]
      }
  })

  Object.keys(hyperPartitionStringToDetailsMap).forEach(key => {
      const hyperPartitionId = hyperPartitionStringToDetailsMap[key][ID]
      hyperPartitionStringToDetailsMap[key][CV_VALUES] = hyperPartitionIdToCVMap[hyperPartitionId]
      hyperPartitionStringToDetailsMap[key][METHOD] = hyperPartitionIdToCVMap[hyperPartitionId][0][METHOD]

  });

  return hyperPartitionStringToDetailsMap

}


export const createHyperPartitionsChartData = (classifierData: any, hyperPartitionData: any, algorithm: any) => {
  let tunables;
  for (let d of hyperPartitionData) {
      if (d[METHOD] === algorithm) {
          let element: any = {};
          element["x"] = d[TUNABLES]
          tunables = d[TUNABLES];
          break;
      }
  }

  // console.log('tunables')
  // console.log(tunables)

  const hyperParametersChartData: any = {};
  tunables && Object.keys(tunables).forEach(key => {
      const newDataPoint: any = [];
      classifierData.forEach((d: any) => {
        // console.log('d')
        // console.log(d)
        // console.log('algorithm')
        // console.log(algorithm)
          if (d[METHOD] === algorithm) {
              console.log('here')
              let element: any = {};
              element["x"] = d[HYPERPARAMETERS][key];
              element["y"] = d[CV_METRIC];
              element["color"] = AREA_GRAPH_SIZE_CONSTANTS[algorithm]["color"];
              element["id"] = d[ID];
              // console.log('element')
              // console.log(element)

              newDataPoint.push(element);

              // console.log('newDataPoint')
              // console.log(newDataPoint)
          }
      });

      hyperParametersChartData[key] = newDataPoint;
  });

  let keys = Object.keys(hyperParametersChartData);
  // console.log('hyperParametersChartData')
  // console.log(hyperParametersChartData)

  return {hyperParametersChartData, keys};
}


export const kernelEpanechnikov = (k: any) => {
  return (v: any) => {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

export const kernelDensityEstimator = (kernel: any, X: any) => {
  return (V: any) => {
      return X.map((x: any) => {
          return [x, d3.mean(V, function (v: any) {
              return kernel(x - v);
          })];
      });
  };
}
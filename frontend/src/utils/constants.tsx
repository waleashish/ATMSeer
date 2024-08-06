import * as d3 from "d3";

export const TEST_METRIC = "test_metric";
export const METHOD = "method";
export const CV_METRIC = "cv_metric";
export const START_TIME = "start_time";
export const END_TIME = "end_time";
export const HYPERPARTITION_STRING = "hyperpartition_string";
export const HYPERPARTITION_ID = "hyperpartition_id";
export const ID = "id";
export const CV_VALUES = "cv_values";
export const TUNABLES = "tunables";
export const HYPERPARAMETERS = "hyperparameters";
export const TRANSITION_DURATION = 2000;

export const AREA_GRAPH_SIZE_CONSTANTS: any = {
  knn:    { areaHeight: 0.7, color: "blue"    },
  logreg: { areaHeight: 0.1, color: "red"     },
  svm:    { areaHeight: 0.3, color: "green"   },
  rf:     { areaHeight: 4,   color: "purple"  },
  et:     { areaHeight: 1,   color: "orange"  },
  dt:     { areaHeight: 1,   color: "yellow"  },
  sgd:    { areaHeight: 2,   color: "black"   },
  pa:     { areaHeight: 1,   color: "brown"   },
  gnb:    { areaHeight: 1,   color: "pink"    },
  bnb:    { areaHeight: 1,   color: "grey"    },
  gp:     { areaHeight: 1,   color: "cyan"    },
  mlp:    { areaHeight: 1,   color: "magenta" },
  mnb:    { areaHeight: 3,   color: "olive"   },
  ada:    { areaHeight: 1.5, color: "navy"    },
};

export const algoColorScale: any = d3.scaleOrdinal()
  .domain([
    "knn", "logreg", "svm", "rf", "et", "dt", "sgd", "pa", "gnb", "bnb", "gp", "mlp", "mnb", "ada"
  ])
  .range([
    "#0000ff", // knn - blue
    "#ff0000", // logreg - red
    "#008000", // svm - green
    "#800080", // rf - purple
    "#ffa500", // et - orange
    "#ffff00", // dt - yellow
    "#000000", // sgd - black
    "#964b00", // pa - brown
    "#ff69b4", // gnb - pink
    "#808080", // bnb - grey
    "#00ffff", // gp - cyan
    "#ff00ff", // mlp - magenta
    "#556b2f", // mnb - olive
    "#03055b" // ada - navy
  ]);

export const TOOLTIP = d3
  .select('body')
  .append('div')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')
  .style('background-color', 'white')
  .style('border', 'solid')
  .style('border-width', '2px')
  .style('border-radius', '5px')
  .style('padding', '5px');

export const verticalBarPlotMargins = { top: 20, right: 30, bottom: 90, left: 40 }
export const horizontalBarPlotMargins = { top: 20, right: 30, bottom: 40, left: 40 }
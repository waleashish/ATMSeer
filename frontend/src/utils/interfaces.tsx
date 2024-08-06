export interface DatasetUploadProps {
  activeDatasetId: string;
  setActiveDatasetId: (id: string) => void;
}

export interface DatarunConfigProps {
  activeDatasetId: string;
  activeDatarunId: string;
  setActiveDatarunId: (id: string) => void;
}

export interface DatarunConfigPopupProps {
  activeDatasetId: string;
  updateDropdown: () => void;
}

export interface SideBarProps {
  activeDatasetId: string;
  setActiveDatasetId: (id: string) => void;
  activeDatarunId: string;
  setActiveDatarunId: (id: string) => void;
}

export interface MainWindowProps {
  activeDatasetId: string;
  activeDatarunId: string;
}

export interface TrialsSectionProps {
  activeDatarunId: string;
}

export interface AlgorithmsSectionsProps {
  activeDatarunId: string;
  setAlgorithmSelected: (algo: string) => void;
}

export interface AlgorithmChartProps {
  algo: string;
  data: any;
}

export interface HyperPartitionSectionProps {
  activeDatarunId: string;
  algorithm: string;
}

export interface HyperPartitionChartByAlgoSectionProps {
  data: any;
}

export interface HyperParametersSectionProps {
  activeDatarunId: string;
  algorithm: string;
}

export interface DataTabSummaryProps {
  numRows: number;
  numColumns: number;
  classSummary: any[];
}

export interface SideBarTabsProps {
  activeDatasetId: string;
  activeDatarunId: string;
}

export interface DataTabProps {
  activeDatasetId: string;
}

export interface FeaturePlotProps {
  data: any;
  column: any;
}

export interface OverviewTabProps {
  activeDatarunId: string;
}

export interface ClassifierAccordionProps {
  classifier: any;
}

export interface OverviewBarChartProps {
  activeDatarunId: string;
}

export interface ExplainabilitySectionProps {
  activeDatarunId: string;
  algorithm: string;
}
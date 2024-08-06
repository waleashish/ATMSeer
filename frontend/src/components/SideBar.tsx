import DatasetUpload from "./sidebar/DatasetUpload";
import DatarunConfig from "./sidebar/DatarunConfig";
import SideBarTabs from "./SideBarTabs";
import { SideBarProps } from "@/utils/interfaces";

const SideBar = (props: SideBarProps) => {
  return (
    <div style={{"fontSize": "14px"}}>
      <div className="mb-4">
        <DatasetUpload
          activeDatasetId={props.activeDatasetId}
          setActiveDatasetId={props.setActiveDatasetId}
        ></DatasetUpload>
      </div>
      <div className="mb-4">
      <DatarunConfig
        activeDatasetId={props.activeDatasetId}
        activeDatarunId={props.activeDatarunId}
        setActiveDatarunId={props.setActiveDatarunId}
      ></DatarunConfig>
      </div>
      <div className="mb-4 w-full">
      <SideBarTabs
        activeDatasetId={props.activeDatasetId}
        activeDatarunId={props.activeDatarunId}
      />
      </div>
    </div>
  );
};

export default SideBar;

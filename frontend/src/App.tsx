import "./App.css";

import { useEffect, useState } from "react";
import MainWindow from "./components/MainWindow";
import SideBar from "./components/SideBar";
import { getClassifiers, getDatasetFile } from "./utils/api";
import { wrangleData } from "./utils/helper";

function App() {
  // vars
  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [activeDatarunId, setActiveDatarunId] = useState<string>("");

  // functions
  useEffect(() => {
    const interval = setInterval(pollClassifiers, 1000);
    return () => clearInterval(interval);
  }, [activeDatarunId, activeDatasetId]);

  useEffect(() => {
    console.log("Active dataset id: ", activeDatasetId);
    getDatasetFile(+activeDatasetId)
      .then((file) => {
        console.log("File received");
        console.log(file);
        console.log(file.slice(0, 10));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const pollClassifiers = () => {
    console.log("Polling classifiers");
    console.log(activeDatarunId, activeDatasetId);
    if (activeDatarunId && activeDatasetId) {
      // poll classifiers
      getClassifiers(+activeDatarunId, "complete")
        .then((classifiers) => {
          // console.log(classifiers);
          const data = wrangleData(classifiers);
          // console.log(data);
          return classifiers;
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log("No active datarun or dataset");
    }
  };

  // setters

  // render
  return (
    <div className="flex flex-wrap w-full">
      <div className="w-1/5 px-2">
        <div className="p-4 border border-gray-200 rounded">
          {/* Content for column 1 goes here */}
          <SideBar
            activeDatasetId={activeDatasetId}
            setActiveDatasetId={setActiveDatasetId}
            activeDatarunId={activeDatarunId}
            setActiveDatarunId={setActiveDatarunId}
          ></SideBar>
        </div>
      </div>
      <div className="w-4/5 px-2">
        <div className="p-4 border border-gray-200 rounded">
          {/* Content for column 2 goes here */}
          <MainWindow
            activeDatasetId={activeDatasetId}
            activeDatarunId={activeDatarunId}
          ></MainWindow>
        </div>
      </div>
    </div>
  );
}

export default App;

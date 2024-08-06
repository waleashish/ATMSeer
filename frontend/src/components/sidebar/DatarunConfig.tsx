import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { getConfigs, getDataRunByDatasetId, startWorker, stopWorker } from "@/utils/api";
import NewDatarunPopup from "./NewDatarunPopup";
import { DatarunConfigProps } from "@/utils/interfaces";
import { toast } from "sonner";

const DatarunConfig = ({ activeDatasetId, activeDatarunId, setActiveDatarunId }: DatarunConfigProps) => {
  // vars
  const [workerStatus, setWorkerStatus] = useState<boolean>(false);
  const [datarunNames, setDatarunNames] = useState<string[]>([]);

  // functions
  useEffect(() => {
    updateDropdown(true);
  }, [activeDatasetId]);

  const updateDropdown = (clear: boolean = false) => {
    if (clear) { setDatarunNames([]); }

    getDataRunByDatasetId(+activeDatasetId)
      .then((dataruns) => {
        console.log(dataruns);
        dataruns.forEach((datarun: any) => {
          setDatarunNames((prev: string[]) => {
            if (prev.includes(datarun.id)) {
              return prev;
            }

            return [
              ...prev,
              datarun.id
            ];
          });
        })
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const toggleWorker = () => {
    console.log("Worker toggled");
    setWorkerStatus((prev) => {
      if (prev){
        stopWorker(+activeDatarunId).then(() => {
          console.log("Worker stopped");
          toast.success("Worker stopped");
        }).catch((err) => {
          console.error(err);
          toast.error("Failed to stop worker");
        });
      } else {
        startWorker(+activeDatarunId).then(() => {
          console.log("Worker started");
          toast.success("Worker started");
        }).catch((err) => {
          console.error(err);
          toast.error("Failed to start worker");
        });
      }
      return !prev;
    });
  }
  

  // setters
  const datarunDropdownLabel = activeDatarunId ? activeDatarunId : "Select";

  // render
  return (
    <div className="items-center">
      <Label htmlFor="datarunConfig">Datarun</Label>
      <div className="flex flex-row mt-1">
        {/* Create new datarun */}
        <div className="mx-auto">

        <NewDatarunPopup activeDatasetId={activeDatasetId} updateDropdown={updateDropdown}></NewDatarunPopup>
        </div>
        

        {/* Dropdown to select a datarun, by default first one selected */}
        <div className="mx-auto">

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              {datarunDropdownLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {
              datarunNames.map((datarunName) => {
                return (
                  <DropdownMenuItem key={datarunName} onClick={() => setActiveDatarunId(datarunName)}>
                    {datarunName}
                  </DropdownMenuItem>
                )
              })
            }
          </DropdownMenuContent>
        </DropdownMenu>
        </div>

        {/* Button to start or stop worker */}
        <div className="mx-auto">

        <Button variant="outline" onClick={toggleWorker}>
          {workerStatus ? "Stop" : "Start"}
        </Button>
      </div>
        </div>
    </div>
  )
}

export default DatarunConfig
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { uploadDataset, getDatasets } from "@/utils/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DatasetUploadProps } from "@/utils/interfaces";

const DatasetUpload = ({ activeDatasetId, setActiveDatasetId }: DatasetUploadProps) => {
  // variables
  const inputRef = useRef(null);
  const [datasetNames, setDatasetNames] = useState<Record<string, string>>({})

  // functions
  useEffect(() => {
    updateDatasetList();
  }, [])

  const updateDatasetList = () => {
    getDatasets().then((datasets) => {
      console.log(datasets);
      datasets.forEach((dataset: any) => {
        setDatasetNames((prev) => {
          const newItem = { [dataset.id]: dataset.name };
          return { ...prev, ...newItem };
        });
      })
    });
  }

  const handleDatasetUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    uploadDataset(formData).then((res) => {
      toast.success("Dataset uploaded successfully");
      updateDatasetList();
    }).catch((err) => {
      toast.error("Failed to upload dataset");
    })
  };

  const handleBtnClick = () => {
    if (inputRef.current) {
      const input = inputRef.current as HTMLInputElement;
      input.click();
    }
  };

  const handleDatasetSelect = (datasetId: string) => {
    setActiveDatasetId(datasetId);
  }

  // setters
  const datasetDropdownLabel = activeDatasetId ? datasetNames[activeDatasetId] : "Select";

  // render
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">

      <Label htmlFor="dataset">Dataset</Label>
      <Input
        className="hidden"
        id="dataset"
        type="file"
        ref={inputRef}
        onChange={handleDatasetUpload}
      />
      <div className="flex flex-row">
        <DropdownMenu >
          <DropdownMenuTrigger className="mx-auto">
            <Button variant="outline">
              {datasetDropdownLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {
              Object.keys(datasetNames).map((datasetId: string) => {
                return (
                  <DropdownMenuItem key={datasetId} onClick={() => handleDatasetSelect(datasetId)}>
                    {datasetNames[datasetId]}
                  </DropdownMenuItem>
                );
              })
            }
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="mx-auto" variant="outline" onClick={() => handleBtnClick()}>
          Upload
        </Button>
      </div>
    </div>
  );
};

export default DatasetUpload;

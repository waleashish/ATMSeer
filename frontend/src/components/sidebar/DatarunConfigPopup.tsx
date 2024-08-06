import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createNewDatarun, getConfigs } from "@/utils/api";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { DatarunConfigPopupProps } from "@/utils/interfaces";
import { toast } from "sonner";


const DatarunConfigPopup = ({activeDatasetId, updateDropdown}: DatarunConfigPopupProps) => {
  // vars
  const [config, setConfig] = useState<any>({});
  const [methods, setMethods] = useState<any>([]);
  const [budget, setBudget] = useState<number>(0);

  // functions
  useEffect(() => {
    setDefaultConfig();
  }, []);

  const setDefaultConfig = () => {
    getConfigs()
      .then((configs) => {

        setBudget(configs.budget);

        console.log(configs);
        setConfig(configs);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(+e.target.value)
  };

  const handleCheckBoxChange = (method: string) => {
    setMethods((prev: any) => {
      if (prev.includes(method)) {
        prev = prev.filter((m: string) => m !== method);
      } else {
        prev.push(method);
      }
      console.log(prev);
      return prev;
    })
  }

  const handleSubmit = () => {

    getConfigs().then((config) => {
      const defaultBudget = config.budget;

      let newConfig = config
      newConfig.methods = methods
      newConfig.budget = budget

      setMethods([]);
      setBudget(defaultBudget);

      createNewDatarun(newConfig, +activeDatasetId).then(() => {
        console.log("Datarun created");
        toast.success("Datarun created successfully");
        updateDropdown();
      }).catch((err) => {
        console.error(err);
        toast.success("Datarun creation failed");
      })

    }).catch((err) => {
      console.error(err);
    })
  }

  // setter

  // render
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Datarun Configuration</AlertDialogTitle>
        <AlertDialogDescription>
          Select the methods and budget for the datarun
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="">
        {config.methods &&
          config.methods.map((method: any, index: number) => {
            return (
              <div className="" id={`checkbox-${index}`}>
                <Checkbox id={method} onClick={() => handleCheckBoxChange(method)}/>
                <label className="ml-1" htmlFor={method}>{method}</label>
              </div>
            )
          })}
      </div>

      <div className="flex">
        <Input id="budget" type="number" value={budget} onChange={handleBudgetChange}></Input>
        <Label htmlFor="budget">Budget (Number of Classifiers)</Label>
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleSubmit}>
            Submit
          </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DatarunConfigPopup;

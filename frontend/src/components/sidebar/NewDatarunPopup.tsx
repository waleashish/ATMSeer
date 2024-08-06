import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { getConfigs } from "@/utils/api";
import DatarunConfigPopup from "./DatarunConfigPopup";
import { useState } from "react";
import { DatarunConfigPopupProps } from "@/utils/interfaces";


const NewDatarunPopup = ({activeDatasetId, updateDropdown}: DatarunConfigPopupProps) => {
  // vars

  // functions

  // setter

  // render
  return (
    <AlertDialog>

      <AlertDialogTrigger>
        <Button variant="outline">
        New
        </Button>
        </AlertDialogTrigger>

        <DatarunConfigPopup activeDatasetId={activeDatasetId} updateDropdown={updateDropdown}></DatarunConfigPopup>


    </AlertDialog>

  )
}

export default NewDatarunPopup
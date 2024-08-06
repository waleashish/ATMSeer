import React from "react";
import DataTab from "./sidebar/DataTab";
import OverviewTab from "./sidebar/OverviewTab";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SideBarTabsProps } from "@/utils/interfaces";

const SideBarTabs = ({activeDatarunId, activeDatasetId} : SideBarTabsProps) => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList>
        <TabsTrigger value="data" className="mx-auto">Data</TabsTrigger>
        <TabsTrigger value="overview" className="mx-auto">Overview</TabsTrigger>
      </TabsList>
      <TabsContent value="data">
        <DataTab activeDatasetId={activeDatasetId}/>
      </TabsContent>
      <TabsContent value="overview">
        <OverviewTab activeDatarunId={activeDatarunId}/>
      </TabsContent>
    </Tabs>
  );
};

export default SideBarTabs;

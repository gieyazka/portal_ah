"use client";
// import UserData from "./userData";

import { Box, IconButton, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { headerTable, userData } from "@/types/next-auth";
import { useDialogStore, useFilterStore } from "../../../store/store";
import { usePathname, useRouter } from "next/navigation";

import Action_Flow from "@/Components/action_component/action_flow";
import React from "react";
import RenderTable from "../../../Components/table";
import ViewSickFlow from "@/Components/action_component/viewsickflow";
import { Visibility } from "@mui/icons-material";
import _apiFn from "@/utils/apiFn";
import menuData from "../menuItem";

export default function Job_Pending(props: any) {
  const filterStore = useFilterStore();
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    task: { [key: string]: any } | undefined;
  }>({
    open: false,
    task: undefined,
  });
  const dialogStore = useDialogStore();

  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const [loading, setLoading] = React.useState(false);
  const lastPath = splitPath[splitPath.length - 1];
  const [value, setValue] = React.useState("1");
  const user = _apiFn.useUser();
  const [realData, setRealData] = React.useState();
  const handleClickOpen = (task: {}) => {
    setDialogState({ open: true, task: task });
  };
  let subpath = props.currentSubPath;
  let status =
    subpath === "in_process"
      ? "Waiting"
      : subpath === "reject"
      ? "Rejected"
      : "Success";

  let mytask = _apiFn.useCurrentTask(user?.data?.user);
  React.useMemo(() => {
    if (filterStore.isFetch) {
      setRealData(mytask.data);
    }
  }, [filterStore.isFetch, mytask.data]);
  const headerTable: headerTable[] = [
    { field: "Doc.id", value: "task_id" },
    { field: "Doc.Type", value: "data.flowName" },
    { field: "Request Emp_id", value: "data.requester.empid" },
    {
      field: "Description",
      value: "data.reason",
      width: 200,
      component: (task: any) => (
        <div>
          {task.data.flowName === "leave_flow"
            ? task.data.type
            : task.data.reason}
        </div>
      ),
    },
    { field: "IssueDate", value: "startedAt" },
    // { field: "Pending", value: "data.status" },
    { field: "Pending", value: "data.lastUpdate" },
    {
      field: "Action",
      value: "",
      color: "#F9FBFC",
      component: (task: any) => (
        <div>
          <div className="flex justify-center">
            {Action_Flow({ task, dialogStore, type: "reject" })}
            {Action_Flow({ task, dialogStore, type: "approve" })}
            {ViewSickFlow({ task, dialogStore })}
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className=" relative overflow-auto  ">
      <RenderTable
        headerTable={headerTable}
        loading={loading}
        data={realData}
      />
    </div>
  );
}

"use client";
// import UserData from "./userData";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tab,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { headerTable, menuItem, subMenu } from "@/types/next-auth";
import { useDialogStore, useFilterStore } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";

import React from "react";
import RenderDialog from "@/Components/Dialog";
import RenderTable from "@/Components/table";
import ViewSickFlow from "@/Components/action_component/viewsickflow";
import _apiFn from "@/utils/apiFn";
import { filter } from "lodash";
import menuData from "../menuItem";

export default function SubComponent(props: any) {
  //  const router = useRouter ()
  // console.log(router);
  const filterStore = useFilterStore();
  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const [loading, setLoading] = React.useState(false);
  const lastPath = splitPath[splitPath.length - 1];
  const [value, setValue] = React.useState("1");
  const user = _apiFn.useUser();
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    task: { [key: string]: any } | undefined;
  }>({
    open: false,
    task: undefined,
  });
  const dialogStore = useDialogStore();

  const [realData, setRealData] = React.useState();
  let subpath = props.currentSubPath;
  let status =
    subpath === "in_process"
      ? "Waiting"
      : subpath === "reject"
      ? "Rejected"
      : "Success";

  let mytask = _apiFn.useMyTask({
    empid: user?.data?.user?.name,
    status: status,
    startDate: filterStore.startDate,
    endDate: filterStore.endDate,
    isFetch: filterStore.isFetch,
  });

  const handleClickOpen = (task: {}) => {
    setDialogState({ open: true, task: task });
  };

  React.useMemo(() => {
    if (filterStore.isFetch) {
      setRealData(mytask.data);
    }
  }, [filterStore.isFetch, mytask.data]);

  const headerTable: headerTable[] = [
    { field: "Doc.id", value: "task_id" },
    { field: "Doc.Type", value: "data.flowName" },
    { field: "Request Emp_id", value: "data.requester.empid" },
    { field: "Description", value: "data.reason", width: 200 },
    { field: "IssueDate", value: "startedAt" },
    // { field: "Pending", value: "data.status" },
    { field: "Pending", value: "data.lastUpdate" },
    {
      field: "Action",
      value: "",
      color: "#F9FBFC",
      component: (task: any) => ViewSickFlow({ task, dialogStore }),
    },
  ];

  return (
    <div className=" relative overflow-auto ">
      <RenderTable
        headerTable={headerTable}
        loading={loading}
        data={realData}
      />

    </div>
  );
}

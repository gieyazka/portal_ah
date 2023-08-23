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
import { headerTable, menuItem, subMenu, task } from "@/types/next-auth";
import { useDialogStore, useFilterStore, useViewStore } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";

import Card_Mobile from "./card_mobile";
import React from "react";
import RenderDialog from "@/Components/Dialog";
import RenderTable from "./table";
import { SWRResponse } from "swr";
import ViewSickFlow from "@/Components/action_component/viewsickflow";
import _apiFn from "@/utils/apiFn";
import _fn from "@/utils/common";
import { filter } from "lodash";
import menuData from "../menuItem";

export default function SubComponent(props: any) {
  //  const router = useRouter ()
  // console.log(router);
  const filterStore = useFilterStore();
  const viewStore = useViewStore();
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
    empid: user?.data?.user?.username,
    status: status,
    startDate: filterStore.startDate,
    endDate: filterStore.endDate,
    isFetch: filterStore.isFetch,
  });

  React.useEffect(() => {
    if (dialogStore.open && dialogStore.task !== undefined) {
      const selectedTask = mytask.data?.find(
        (d: any) => d.task_id === dialogStore.task?.task_id
      );
      if (selectedTask === undefined) {
        dialogStore.onCloseDialog();
      } else {
        dialogStore.onReload({ task: selectedTask });
      }
    }
  }, [mytask.data]);
  const handleClickOpen = (task: {}) => {
    setDialogState({ open: true, task: task });
  };

  // React.useMemo(() => {
  //   if (filterStore.isFetch) {
  //     setRealData(mytask.data);
  //   }
  // }, [filterStore.isFetch, mytask.data]);
  const headerTable: headerTable[] = [
    // { field: "Doc.id", value: "task_id" },
    { label: "Doc.Type", field: "Doc.Type", value: "data.flowName" },
    { label: "Emp.ID", field: "Emp_id", value: "data.requester.empid" ,     width: 150, },
    { label: "Requester", field: "Requester ", value: "data.requester.name"  ,    width: 300,},
    {
      label: "Description",
      field: "Description",
      value: "data.reason",
      width: 200,
    },
    { label: "Issue Date", field: "IssueDate", value: "issueDate" },
    // { field: "Pending", value: "data.status" },
    { label: "Pending", field: "Pending", value: "data.lastUpdate" },
    {
      label: "Action",
      field: "Action",
      value: "",
      // color: "#F9FBFC",
      actionClick: ({ task, iconStyle }: { task: any; iconStyle?: string }) => {
        //@ts-ignore
        dialogStore.onOpenDialog({ task, swrResponse: mytask });
      },

      component: ({ task, iconStyle }: { task: any; iconStyle?: string }) =>
        ViewSickFlow({ task, dialogStore, swrResponse: mytask, iconStyle }),
    },
  ];
  if (!viewStore.isMd) {
    return (
      <Card_Mobile
        headerTable={headerTable}
        loading={mytask.isLoading}
        data={mytask.data}
        swrResponse={mytask}
      />
    );
  }
  return (
    <div className=" relative overflow-auto  h-full">
      <RenderTable
        headerTable={headerTable}
        loading={mytask.isLoading}
        data={mytask.data}
      />
    </div>
  );
}

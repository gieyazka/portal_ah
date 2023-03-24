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
import { useMyTask, useUser } from "@/utils/apiFn";
import { usePathname, useRouter } from "next/navigation";

import React from "react";
import  RenderDialog  from "@/Components/dialog";
import RenderTable from "./table";
import { filter } from "lodash";
import menuData from "../menuItem";
import { useFilterStore } from "./store";

export default function SubComponent(props: any) {
  //  const router = useRouter ()
  // console.log(router);
  const filterStore = useFilterStore();
  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const [loading, setLoading] = React.useState(false);
  const lastPath = splitPath[splitPath.length - 1];
  const [value, setValue] = React.useState("1");
  const user = useUser();
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    task: { [key: string]: any } | undefined;
  }>({
    open: false,
    task: undefined,
  });
  const [realData, setRealData] = React.useState();
  let subpath = props.currentSubPath;
  let status =
    subpath === "in_process"
      ? "Waiting"
      : subpath === "reject"
      ? "Rejected"
      : "Success";

  let mytask = useMyTask({
    empid: user?.data?.user?.name,
    status: status,
    startDate: filterStore.startDate,
    endDate: filterStore.endDate,
    isFetch: filterStore.isFetch,
  });

  const handleClickOpen = (task: {}) => {
    setDialogState({ open: true, task: task });
  };

  const handleClose = () => {
    setDialogState({ open: false, task: undefined });
  };
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (dialogState.open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [dialogState.open]);

  React.useMemo(() => {
    if (filterStore.isFetch) {
      setRealData(mytask.data);
    }
  }, [filterStore.isFetch, mytask.data]);

  const headerTable: headerTable[] = [
    { field: "Doc.id", value: "task_id" },
    { field: "Doc.Type", value: "data.flowName" },
    { field: "Request Emp_id", value: "data.requester.empid" },
    { field: "Description", value: "data.reason" ,width : 200},
    { field: "IssueDate", value: "startedAt" },
    // { field: "Pending", value: "data.status" },
    { field: "Pending", value: "data.lastUpdate" },
    {
      field: "Action",
      value: "",
      color: "#F9FBFC",
      component: (task: any) =>
        ViewSickFlow({ task, handleClickOpen: handleClickOpen }),
    },
  ];

  
  return (
    <div className=" relative overflow-auto ">
      <RenderTable
        headerTable={headerTable}
        loading={loading}
        data={realData}
      />
     
        <RenderDialog dialogState={dialogState} handleClose={handleClose} descriptionElementRef={descriptionElementRef} user={user} />
   
    </div>
  );
}





const ViewSickFlow = ({
  task,
  handleClickOpen,
}: {
  task: any;
  handleClickOpen: (flowName: {}) => void;
}) => {
  return (
    <IconButton
      aria-label="delete"
      size="large"
      onClick={async () => {
        handleClickOpen(task);
      }}
    >
      <VisibilityIcon />
    </IconButton>
  );
};

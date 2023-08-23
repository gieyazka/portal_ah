"use client";
// import UserData from "./userData";

import { Box, IconButton, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { headerTable, userData } from "@/types/next-auth";
import {
  useActionDialogStore,
  useDialogStore,
  useFilterStore,
  useSnackbarStore,
  useViewStore,
} from "../../../store/store";
import { usePathname, useRouter } from "next/navigation";

import Card_Mobile from "./card_mobile";
import React from "react";
import RenderTable from "./table";
import ViewSickFlow from "@/Components/action_component/viewsickflow";
import { Visibility } from "@mui/icons-material";
import _apiFn from "@/utils/apiFn";
import menuData from "../menuItem";

export default function Action_log(props: any) {
  const filterStore = useFilterStore();
  const viewStore = useViewStore();
  const dialogStore = useDialogStore();
  const actionDialogStore = useActionDialogStore();
  const snackbarStore = useSnackbarStore();

  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const [loading, setLoading] = React.useState(false);
  const lastPath = splitPath[splitPath.length - 1];
  const [value, setValue] = React.useState("1");
  const user = _apiFn.useUser();
  const [realData, setRealData] = React.useState();

  let subpath = props.currentSubPath;

  let mytask = _apiFn.useAction_logs({
    user: user?.data?.user,
    filterStore: filterStore,
  });
  React.useMemo(() => {
    if (filterStore.isFetch) {
      setRealData(mytask.data);
    }
  }, [filterStore.isFetch, mytask.data]);
  const headerTable: headerTable[] = [
    // { field: "Doc.id", value: "task_id" },
    { label: "Doc.Type", field: "Doc.Type", value: "data.flowName" },

    {
      label: "Emp.ID",
      field: "Emp_id",
      value: "data.requester.empid",
      width: 150,
    },
    {
      label: "Requester",
      field: "Requester",
      value: "data.requester.name",
      width: 300,
    },
    {
      label: "Description",
      field: "Description",
      value: "data.reason",
      component: ({ task, iconStyle }: { task: any; iconStyle?: string }) => (
        <div>
          {task.data.flowName === "leave_flow"
            ? task.data.type.label
            : task.data.reason}
        </div>
      ),
    },
    { label: "IssueDate", field: "IssueDate", value: "issueDate" },
    { label: "Req.Status", field: "status", value: "data.status" },
    // { field: "Pending", value: "data.lastUpdate" },

    {
      label: "Action",
      field: "Action",
      value: "",
      // color: "#F9FBFC",
      actionClick: ({ task, iconStyle }: { task: any; iconStyle?: string }) => {
        //@ts-ignore
        dialogStore.onOpenDialog({ task, mytask });
      },
      component: ({ task, iconStyle }: { task: any; iconStyle?: string }) => {
        return (
          <div>
            <div className="flex justify-center">
              {task.data.flowName === "leave_flow" &&
                ViewSickFlow({
                  task,
                  dialogStore,
                  swrResponse: mytask,
                  iconStyle,
                })}
            </div>
          </div>
        );
      },
    },
  ];
  if (!viewStore.isMd) {
    return (
      <div className="w-full mt-2">
        <Card_Mobile
          headerTable={headerTable}
          loading={mytask.isLoading}
          data={realData}
          swrResponse={mytask}
        />
      </div>
    );
  }
  return (
    <div className=" relative overflow-auto  h-full ">
      <RenderTable
        subpath={subpath}
        headerTable={headerTable}
        loading={loading}
        data={realData}
      />
    </div>
  );
}

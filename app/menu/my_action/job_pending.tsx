"use client";
// import UserData from "./userData";

import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useCurrentTask, useMyTask, useUser } from "@/utils/apiFn";
import { usePathname, useRouter } from "next/navigation";

import React from "react";
import RenderTable from "./table";
import menuData from "../menuItem";
import { userData } from "@/types/next-auth";

export default function Job_Pending(props: any) {
  
  //  const router = useRouter ()
  // console.log(router);
  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const [loading, setLoading] = React.useState(false);
  const lastPath = splitPath[splitPath.length - 1];
  const [value, setValue] = React.useState("1");
  const user = useUser();
  let subpath = props.currentSubPath;
  let status =
    subpath === "in_process"
      ? "Waiting"
      : subpath === "reject"
      ? "Rejected"
      : "Success";

  let mytask = useCurrentTask(user?.data?.user);
  // console.log({ ...mytask });
  const headerTable: {
    field: string;
    value: string;
    color: string;
    fontColor?: string;
  }[] = [
    { field: "Doc.id", value: "id", color: "#9BBB59" },
    { field: "Doc.Type", value: "data.flowName", color: "#9BBB59" },
    { field: "Description", value: "data.reason", color: "#9BBB59" },
    { field: "IssueDate", value: "startedAt", color: "#9BBB59" },
    { field: "Pending", value: "data.status", color: "#9BBB59" },
    { field: "Action", value: "", color: "#9BBB59" },
  ];

  return (
    <div className=" relative overflow-auto  bg-green-400">
      <RenderTable
        headerTable={headerTable}
        loading={loading}
        mytask={mytask}
      />
    </div>
  );
}

"use client";
// import UserData from "./userData";

import { Box, Tab, Typography } from "@mui/material";
import React, { Suspense } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { menuItem, subMenu } from "@/types/next-auth";
import { useFilterStore, useViewStore } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Action_log from "./action_log";
import Job_Pending from "./job_pending";
import menuData from "../menuItem";

export default function MyAction(props: { searchParams: { current: string } }) {
  const router = useRouter();
  const viewstore = useViewStore();
  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const lastPath = splitPath[splitPath.length - 1];
  const currentMenu: menuItem | undefined = menuData.find(
    (d) => d.url === lastPath
  );
  const filterStore = useFilterStore();
  const searchParams = useSearchParams();
  const [currentSubPath, setCurrentSubPath] = React.useState(
    searchParams.get("current") === undefined
      ? currentMenu !== undefined && currentMenu.subMenu[0].url
      : searchParams.get("current")
  );

  React.useEffect(() => {
    if (searchParams.get("current") !== undefined) {
      setCurrentSubPath(searchParams.get("current"));
    }
  }, [searchParams.get("current")]);
  return (
    <div className="h-full">
      <div className=" h-full w-full">
        {currentSubPath === "job_pending" ? (
          // <Suspense fallback={<>Loading</>}>
          <Job_Pending currentSubPath={currentSubPath} />
        ) : // </Suspense>
        currentSubPath === "action_logs" ? (
          <Action_log currentSubPath={currentSubPath} />
        ) : (
          <>t</>
        )}
      </div>
    </div>
  );
}

"use client";
// import UserData from "./userData";

import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { menuItem, subMenu } from "@/types/next-auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import React from "react";
import SubComponent from "../../../Components/myTask/my_request";
import menuData from "../../../Components/menuItem";
import { useViewStore } from "@/store/store";

export const dynamic = "force-dynamic";
export default function MyTask(props: { searchParams: { current: string } }) {
  const viewstore = useViewStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const lastPath = splitPath[splitPath.length - 1];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    router.replace(`/menu/my_task?current=${newValue}`);
    // setCurrentSubPath(newValue);
  };
  const currentMenu: menuItem | undefined = menuData.find(
    (d) => d.url === lastPath
  );

  const [currentSubPath, setCurrentSubPath] = React.useState(
    searchParams.get("current") === undefined
      ? currentMenu !== undefined && currentMenu.subMenu[0].url
      : searchParams.get("current")
  );
  // const currentSubPath =
  //  searchParams.get("current") === undefined
  //     ? currentMenu?.subMenu[0].url
  //     :searchParams.get("current");
  React.useEffect(() => {

    if (searchParams.get("current") !== undefined) {
      setCurrentSubPath(searchParams.get("current"));
    }
  }, [searchParams.get("current")]);
  return (
    // <div className=" p-1 bg-white rounded-xl">
    <div className="h-full w-full">
      <SubComponent currentSubPath={currentSubPath} />
    </div>
  );
}

"use client";
// import UserData from "./userData";

import { Box, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { menuItem, subMenu } from "@/types/next-auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import React from "react";
import SubComponent from "./subComponent";
import menuData from "../menuItem";

export const dynamic = "force-dynamic";
export default function MyTask(props: { searchParams: { current: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const lastPath = splitPath[splitPath.length - 1];

  // const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  //   router.replace(`/menu/my_task?current=${newValue}`);
  //   setCurrentSubPath(newValue);
  // };
  const currentMenu: menuItem | undefined = menuData.find(
    (d) => d.url === lastPath
  );

  // const [currentSubPath, setCurrentSubPath] = React.useState(
  //   props.searchParams.current === undefined
  //     ? currentMenu !== undefined && currentMenu.subMenu[0].url
  //     : props.searchParams.current
  // );
  const currentSubPath =
   searchParams.get("current") === undefined
      ? currentMenu?.subMenu[0].url
      :searchParams.get("current");
  // React.useEffect(() => {
  //   console.log(props.searchParams);

  //   if (props.searchParams.current !== undefined) {
  //     setCurrentSubPath(props.searchParams.current);
  //   }
  // }, [props.searchParams.current]);
  return (
    <div className="m-2 bg-white rounded-xl">
      <Box
        sx={{
          width: "100%",
          typography: "body1",
          paddingX: "12px",
          paddingY: "12px",
        }}
      >
        <div className="mb-2"></div>
        <SubComponent currentSubPath={currentSubPath} />

        {/* <TabContext value={currentSubPath || ""}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {currentMenu?.subMenu?.map((submenu: subMenu) => {
                return (
                  <Tab
                    key={submenu.name}
                    label={submenu.name}
                    value={submenu.url}
                  />
                );
              })}
            </TabList>
          </Box>
          <div
            className="overflow-auto w-full"
            style={{ height: "calc(100vh - 112px)" }}
          >
            {currentMenu?.subMenu?.map((submenu: subMenu) => {
              return (
                <TabPanel
                  sx={{ padding: "4px", paddingX: "8px" }}
                  key={submenu.name}
                  value={submenu.url}
                >
                  <SubComponent currentSubPath={currentSubPath} />
                </TabPanel>
              );
            })}
          </div>
        </TabContext> */}
      </Box>
    </div>
  );
}

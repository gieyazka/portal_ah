"use client";
// import UserData from "./userData";

import { Box, Tab, Typography } from "@mui/material";
import React, { Suspense } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { menuItem, subMenu } from "@/types/next-auth";
import { usePathname, useRouter } from "next/navigation";

import Job_Pending from "./job_pending";
import menuData from "../menuItem";

export default function MyAction(props: { searchParams: { current: string } }) {
  const router = useRouter();

  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const lastPath = splitPath[splitPath.length - 1];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    router.replace(`/menu/my_action?current=${newValue}`);
    setCurrentSubPath(newValue);
  };
  const currentMenu: menuItem | undefined = menuData.find(
    (d) => d.url === lastPath
  );

  const [currentSubPath, setCurrentSubPath] = React.useState(
    props.searchParams.current === undefined
      ? currentMenu !== undefined && currentMenu.subMenu[0].url
      : props.searchParams.current
  );

  // console.log('34',lastPath,currentMenu,menuData);

  return (
    <div className="">
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={currentSubPath || ""}>
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
            {currentMenu?.subMenu?.map((Submenu: subMenu) => {
              return (
                <TabPanel
                  sx={{ padding: "4px", paddingX: "8px" }}
                  key={Submenu.name}
                  value={Submenu.url}
                >
                  {Submenu.url === "job_pending" ? (
                    // <Suspense fallback={<>Loading</>}>
                      <Job_Pending currentSubPath={currentSubPath} />
                    // </Suspense>
                  ) : (
                    <></>
                  )}
                </TabPanel>
              );
            })}
          </div>
        </TabContext>
      </Box>
    </div>
  );
}

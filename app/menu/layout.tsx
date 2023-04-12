"use client";

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import {
  Backdrop,
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Drafts,
  ExpandLess,
  ExpandMore,
  Inbox,
  MenuBook,
  Send,
  StarBorder,
} from "@mui/icons-material";
import React, { useEffect } from "react";
import { menuItem, subMenu } from "@/types/next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import Menu from "./menuItem";
import Preview_Backdrop from "@/Components/preview_backdrop";
import RenderDialog from "@/Components/Dialog";
import { Session } from "next-auth/core/types";
import _apiFn from "@/utils/apiFn";
import { authOptions } from "pages/api/auth/[...nextauth]";
import axios from "axios";
import fn from "@/utils/common";
import { useDialogStore } from "../../store/store";
import useSWR from "swr";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("layout run");
  const user = _apiFn.useUser();

  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const lastPath = splitPath[splitPath.length - 1];
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarOpen = {
    width: "208px",
  };
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const sidebarClose = {
    width: isLg ? "64px" : "0px",
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(
    Menu.map((d) => {
      return { open: false };
    })
  );

  const handleClick = (current: boolean, index: number) => {
    setOpen((prev) => {
      const newState = { ...prev };
      newState[index].open = !current;
      return newState;
    });
  };
  return (
    <div className="max-w-screen overflow-hidden">
      <div className="flex relative">
        <div
          className={`bg-red-500 absolute h-screen  text-center  text-white z-19  ease-in-out transition-width 
            `}
          style={{
            width: showSidebar ? sidebarOpen.width : sidebarClose.width,
          }}
        ></div>
        <div
          className={`bg-[#1D336D] h-screen z-50  ${
            !showSidebar ? "text-center" : ""
          }  relative text-white z-40  ease-in-out transition-width rounded-tr-3xl
            `}
          style={{
            width: showSidebar ? sidebarOpen.width : sidebarClose.width,
          }}
        >
          <div className="transition ease-in-out">
            {showSidebar ? (
              <AiOutlineMenuFold
                size={24}
                className="ml-auto mt-4 cursor-pointer mr-4 "
                onClick={() => setShowSidebar(!showSidebar)}
              />
            ) : (
              isLg && (
                <AiOutlineMenuUnfold
                  size={24}
                  className="mx-auto mt-4 cursor-pointer  "
                  onClick={() => setShowSidebar(!showSidebar)}
                />
              )
            )}
          </div>

          <h3 className=" font-semibold  mt-12">
            <List
              sx={{
                "&, & .MuiListItemIcon-root": {
                  color: "white",
                },
                "&& .Mui-selected, && .Mui-selected:hover": {
                  "&, & .MuiListItemIcon-root": {
                    color: "#309E48",
                  },
                },
              }}
            >
              <div className="flex flex-col">
                {Menu.map((menu, index) => {
                  // console.log(menu);
                  if (!showSidebar && !isLg) {
                    return <></>;
                  }
                  return (
                    <div key={menu.name}>
                      <ListItemButton
                        selected={menu.url === lastPath}
                        onClick={() => handleClick(open[index].open, index)}
                      >
                        <ListMenu showSidebar={showSidebar} menu={menu} />
                      </ListItemButton>
                      <Collapse
                        in={open[index].open}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List
                          component="div"
                          disablePadding
                          sx={{
                            "&, & .MuiListItemIcon-root": {
                              color: "white",
                            },
                            // selected and (selected + hover) states
                            "&& .Mui-selected, && .Mui-selected:hover": {
                              bgcolor: "white",
                              "&, & .MuiListItemIcon-root": {
                                color: "#309E48",
                              },
                            },
                            // hover states
                            "& .MuiListItemButton-root:hover": {
                              bgcolor: "#FFF",
                              "&, & .MuiListItemIcon-root": {
                                color: "#1D336D",
                              },
                            },
                          }}
                        >
                          {menu.subMenu.map((subMenu, indexSubMenu) => {
                            return (
                              <div key={subMenu.name}>
                                <ListItemButton
                                  selected={
                                    menu.url === lastPath &&
                                    subMenu.url === searchParams.get("current")
                                  }
                                  component="a"
                                  sx={{
                                    pl: 3,
                                  }}
                                  onClick={() =>
                                    router.push(
                                      `/menu/${menu.url}?current=${subMenu.url}`
                                    )
                                  }
                                >
                                  <ListMenu
                                    showSidebar={showSidebar}
                                    menu={subMenu}
                                  />
                                </ListItemButton>
                              </div>
                            );
                          })}
                        </List>
                      </Collapse>
                    </div>
                  );
                })}
              </div>
            </List>
          </h3>
        </div>
        <div className="flex flex-col flex-1">
          <div className="bg-red-500 h-16 flex items-center">
            {user.data ? (
              <div className="mx-4 flex">
                {!showSidebar && !isLg && (
                  <AiOutlineMenuUnfold
                    color="white"
                    size={24}
                    className="ml-autocursor-pointer "
                    onClick={() => setShowSidebar(!showSidebar)}
                  />
                )}

                {user.data.user?.rule}
              </div>
            ) : (
              <div className="mx-4">loading</div>
            )}
          </div>

          <div
            className={`overflow-auto  relative  h-[calc(100vh_-_4rem)] transition-width bg-[#F6F7FB] `}
            style={{
              width: showSidebar
                ? `calc(100vw - ${sidebarOpen.width})`
                : `calc(100vw - ${sidebarClose.width})`,
            }}
          >
            {!isLg && (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: 20,
                }}
                open={showSidebar}
                onClick={() => setShowSidebar(!showSidebar)}
              ></Backdrop>
            )}
            {children}
            <RenderDialog />
            <Preview_Backdrop />
          </div>
        </div>
      </div>
    </div>
  );
}

const ListMenu = ({
  showSidebar,
  menu,
}: {
  showSidebar: boolean;
  menu: menuItem | subMenu;
}) => {
  return (
    <ListItemIcon className="">
      {!showSidebar ? (
        <Tooltip title={menu.name} placement="right">
          <p> {menu.icon ? menu.icon({ fontSize: 24 }) : <MenuBook />} </p>
        </Tooltip>
      ) : (
        <p className=" whitespace-nowrap ">
          {" "}
          {menu.icon ? menu.icon({ fontSize: 24 }) : <MenuBook />}
          <span className="ml-4">{menu.name}</span>{" "}
        </p>
      )}
    </ListItemIcon>
  );
};

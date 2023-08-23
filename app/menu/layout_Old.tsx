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
  CheckOutlined,
  Drafts,
  ExpandLess,
  ExpandMore,
  Inbox,
  MenuBook,
  Send,
  StarBorder,
  SubdirectoryArrowRightRounded,
} from "@mui/icons-material";
import React, { useEffect } from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { menuItem, subMenu } from "@/types/next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FilterDrawer from "@/Components/filter_drawer";
import Link from "next/link";
import Menu from "./menuItem";
import Preview_Backdrop from "@/Components/preview_backdrop";
import RenderDialog from "@/Components/Dialog";
import RenderSnackbar from "@/Components/snackbar";
import RenderactionDialog from "@/Components/Dialog/actionDailog";
import { Session } from "next-auth/core/types";
import _apiFn from "@/utils/apiFn";
import { authOptions } from "pages/api/auth/[...nextauth]";
import axios from "axios";
import fn from "@/utils/common";
import useSWR from "swr";
import { useState } from "react";
import { useViewStore } from "@/store/store";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1D336D",
    },
  },
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewStore = useViewStore();
  const user = _apiFn.useUser();
  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const lastPath = splitPath[splitPath.length - 1];
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarOpen = {
    width: "208px",
  };

  const isMdCheck = useMediaQuery(theme.breakpoints.up("md"));
  useEffect(() => {
    viewStore.setMd(isMdCheck);
  }, [isMdCheck]);
  const sidebarClose = {
    width: viewStore.isMd ? "64px" : "0px",
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
  if (viewStore.isMd === undefined || user.isLoading) {
    return <div>Loading...</div>;
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

  const SubListMenu = ({
    isSelect,
    showSidebar,
    menu,
  }: {
    isSelect: boolean;
    showSidebar: boolean;
    menu: menuItem | subMenu;
  }) => {
    return (
      <ListItemIcon className="">
        {!showSidebar ? (
          <Tooltip title={menu.name} placement="right">
            <div
              style={{
                borderWidth: isSelect === true ? "2px" : 0,
                padding: !showSidebar ? "4px 6px 6px 6px" : "0px",
                borderRadius: "24px",
                backgroundColor:
                  !showSidebar && isSelect === true ? "#1D336D" : "#FFF",
                color:
                  !showSidebar && isSelect === true ? "#FFFFFF" : "#1D336D",
              }}
            >
              {" "}
              {menu.icon ? menu.icon({ fontSize: 24 }) : <MenuBook />}{" "}
            </div>
          </Tooltip>
        ) : (
          <div className=" flex whitespace-nowrap flex-1 justify-between  space-x-2">
            <span
              style={
                {
                  // borderColor: isSelect === true ? "#1D336D" : "transparent",
                  // borderWidth :"2px",
                  // color: "#1D336D",
                  // borderRadius: isSelect ? "24px" : "0px",
                }
              }
              className=" py-1 px-2  min-w-max "
            >
              <SubdirectoryArrowRightRounded />
              {menu.name}
            </span>{" "}
            {/* <CheckOutlined /> */}
            {isSelect && <CheckOutlined />}
          </div>
        )}
      </ListItemIcon>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="max-w-screen overflow-hidden">
        <div className="flex relative">
          <div
            className={`bg-[#1D336D] absolute h-screen  text-center  text-white z-19  ease-in-out transition-all 
            `}
            style={{
              width: showSidebar ? sidebarOpen.width : sidebarClose.width,
            }}
          ></div>
          <div
            className={`bg-[#FFFFFF] h-screen z-50  ${
              !showSidebar ? "text-center" : ""
            }  relative text-black text-opacity-80  z-40  ease-in-out transition-width
           
            `}
            //  rounded-tr-3xl border-2 border-[#1D336D]
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
                viewStore.isMd && (
                  <AiOutlineMenuUnfold
                    size={24}
                    className="mx-auto mt-4 cursor-pointer  "
                    onClick={() => setShowSidebar(!showSidebar)}
                  />
                )
              )}
            </div>

            <div className=" font-semibold mt-2">
              <List
                sx={{
                  margin: showSidebar ? "0px 8px" : 0,
                  "&, & .MuiListItemIcon-root": {
                    color: "#1D336D",
                    textOpacity: 0.8,
                  },
                  "&& .Mui-selected, && .Mui-selected:hover": {
                    bgcolor: "#1D336D",
                    borderRadius: showSidebar ? "24px" : "0px",

                    "&, & .MuiListItemIcon-root": {
                      color: "#FFFFFF",

                      width: "auto",
                    },
                  },
                }}
              >
                <div className="flex flex-col">
                  {Menu.map((menu, index) => {
                    // console.log(menu);
                    if (!showSidebar && !viewStore.isMd) {
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
                              marginTop: "2px",

                              // padding: "0px -8px",
                              "&, & .MuiListItemIcon-root": {
                                width: "100%",
                                color: "#1D336D",
                                textOpacity: 0.8,
                              },

                              // selected and (selected + hover) states
                              "&& .Mui-selected, && .Mui-selected:hover": {
                                // backgroundColor : 'red',
                                borderRadius: showSidebar ? "0px" : "0px",
                                // bgcolor: "#1D336D",
                                bgcolor: "#FFFFFF",
                                "&, & .MuiListItemIcon-root": {
                                  color: "#1D336D",
                                  width: "100%",

                                  // color: "#FFFFFF",
                                  textOpacity: 0.8,
                                },
                              },
                              // hover states
                              // "& .MuiListItemButton-root:hover": {
                              //   bgcolor: "#1D336D",
                              //   "&, & .MuiListItemIcon-root": {
                              //     color: "#FFF",
                              //   },
                              // },
                            }}
                          >
                            {menu.subMenu.map((subMenu, indexSubMenu) => {
                              let isSelect =
                                menu.url === lastPath &&
                                subMenu.url === searchParams.get("current");
                              return (
                                <div key={subMenu.name}>
                                  <ListItemButton
                                    selected={isSelect}
                                    // component="a"
                                    sx={{
                                      // pl: 3,
                                      width: "100%",
                                    }}
                                    onClick={() =>
                                      router.push(
                                        `/menu/${menu.url}?current=${subMenu.url}`
                                      )
                                    }
                                  >
                                    <SubListMenu
                                      isSelect={isSelect}
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
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <div className="bg-[#1D336D] text-white w-auto h-16 flex items-center justify-between px-4">
              {user.data ? (
                <div className=" flex items-center">
                  {!showSidebar && !viewStore.isMd && (
                    <AiOutlineMenuUnfold
                      color="white"
                      size={24}
                      className="ml-autocursor-pointer "
                      onClick={() => setShowSidebar(!showSidebar)}
                    />
                  )}
                  <p className="ml-2 whitespace-nowrap  text-xl">
                    {/* AAPICO e-WorkFlow System */}
                    E-WorkFlow Portal
                  </p>

                  {/* <div className="mx-4"> {user.data.user?.rule}</div> */}
                </div>
              ) : (
                <div className="mx-4">loading</div>
              )}
              <div className=" flex gap-1">
                <AssignmentIndIcon />
                {viewStore.isMd
                  ? `${user.data?.user?.fullName} (${user.data?.user?.username})`
                  : user.data?.user?.username}
              </div>
            </div>

            <div
              className={`overflow-auto  relative  h-[calc(100vh_-_4rem)] transition-width bg-[#F6F7FB] `}
              style={{
                width: showSidebar
                  ? `calc(100vw - ${sidebarOpen.width})`
                  : `calc(100vw - ${sidebarClose.width})`,
              }}
            >
              {/* <RenderSnackbar />

              {!viewStore.isMd && (
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: 20,
                  }}
                  open={showSidebar}
                  onClick={() => setShowSidebar(!showSidebar)}
                ></Backdrop>
              )} */}
              {children}

              <RenderDialog />
              {/* <FilterDrawer /> */}
              <RenderactionDialog />

              {/* <Preview_Backdrop /> */}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

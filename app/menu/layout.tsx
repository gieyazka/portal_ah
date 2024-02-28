"use client";

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { HambergerMenu, Logout, LogoutCurve, Settings } from "iconsax-react";
import React, { Suspense, useEffect, useState } from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { menuItem, subMenu } from "@/types/next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { useFilterStore, useViewStore } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FilterDrawer from "@/Components/filter_drawer";
import Link from "next/link";
import MenuData from "../../Components/menuItem";
import MenuMobile from "../../Components/menuMobile";
import { PersonAdd } from "@mui/icons-material";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const viewStore = useViewStore();
  const user = _apiFn.useUser();
  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const lastPath = splitPath[splitPath.length - 1];
  const [showSidebar, setShowSidebar] = useState(false);
  const searchParams = useSearchParams();
  const filterStore = useFilterStore();

  React.useEffect(() => {
    if (searchParams.get("current") === "job_pending") {
      filterStore.handleChangePeriod(0);
    } else {
      filterStore.handleChangePeriod(30);
    }
    filterStore.handleChangePage();
  }, [searchParams.get("current")]);
  // console.log("filterStore", filterStore);
  const sidebarOpen = {
    width: "208px",
  };
  const theme = createTheme({
    typography: {
      fontFamily: "Bai Jamjuree",
    },
    palette: {
      primary: {
        main: "#1D336D",
      },
    },
  });
  const isMdCheck = useMediaQuery(theme.breakpoints.up("md"));
  useEffect(() => {
    viewStore.setMd(isMdCheck);
  }, [isMdCheck]);
  const sidebarClose = {
    width: viewStore.isMd ? "64px" : "0px",
  };
  const router = useRouter();

  if (viewStore.isMd === undefined || user.isLoading) {
    return <div>Loading...</div>;
  }

  const AppBar = () => {
    return (
      <div className={`bg-[#1D336D] text-white w-auto ${viewStore.isMd ? "h-[76px]" : "h-[50px]"} flex items-center justify-between px-4`}>
        <div className=' flex items-center'>
          <img
            src='../../assets/logo.png'
            className={`${!viewStore.isMd ? "h-[32px] w-[32px]" : "h-[48px] w-[48px]"}`}
          />
          <Typography
            component='p'
            className='ml-4 whitespace-nowrap  text-xl'
          >
            E-WorkFlow Portal
          </Typography>
        </div>

        <div className=' flex items-center gap-3'>
          {viewStore.isMd ? (
            <div className='flex items-center gap-2'>
              <AssignmentIndIcon />
              <div className='text-md text-left'>
                <Typography component='p'>{user.data?.user?.fullName}</Typography>
                <Typography component='p'>{user.data?.user?.username}</Typography>
              </div>
            </div>
          ) : (
            <>
              <MenuMobile
                lastPath={lastPath}
                user={user}
              />
            </>
          )}
        </div>
      </div>
    );
  };
  const SideBar = () => {
    return (
      <div className='flex flex-col'>
        <div
          //
          className={` bg-[#1D336D]  z-50 ml-[20px] mt-[54px] ${!showSidebar ? "text-center" : ""}  relative text-white text-opacity-80  z-40  ease-in-out transition-width
           
            `}
          //  rounded-tr-3xl border-2 border-[#1D336D]
          style={{
            borderRadius: "10px 0px 0px 10px",
            boxShadow: " -10px 4px 20px 0px rgba(0, 0, 0, 0.15)",
            width: "184px", //238
            minHeight: "428px",
          }}
        >
          <div className='mt-[34px] text-[#FFF]'>
            {MenuData.map((menu: any, index: number) => {
              return (
                <div key={menu.name}>
                  {index !== 0 && <hr className=' mx-[28px] my-[24px] h-[2px] bg-[#1D336D]' />}
                  <p className='text-lg font-bold'> {menu.name} </p>
                  {menu.subMenu.map((subMenu: any, index: number) => {
                    let isSelect = menu.url === lastPath && subMenu.url === searchParams.get("current");
                    return (
                      <div
                        onClick={() => router.push(`/menu/${menu.url}?current=${subMenu.url}`)}
                        key={subMenu.name}
                        style={{ borderRadius: "10px 0px 0px 10px" }}
                        className={`cursor-pointer
                   
                        mt-[12px] py-[8px] 
                        text-end ml-[20px]  ${isSelect ? `bg-[#1976D2] text-[#FFF] ` : `hover:bg-[#1976D2] hover:opacity-60 hover:text-[#FFF]`}  `}
                      >
                        <p className='text-[16px] mr-[28px]  '> {subMenu.name} </p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            borderRadius: "10px 0px 0px 10px",
            boxShadow: " -10px 4px 20px 0px rgba(0, 0, 0, 0.15)",
          }}
          className='cursor-pointer flex items-center justify-center text-lg bg-[#FFFFFF]  z-50 ml-[20px]  mt-[24px] w-[184px] h-[64px]  text-[#1D336D] hover:bg-[#1D336D]  hover:text-white'
          onClick={() => {
            // console.log(
            //   "",
            //   `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.NEXT_PUBLIC_NEXTAUTH_URL}login`
            // );
            signOut({
              callbackUrl: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.NEXT_PUBLIC_NEXTAUTH_URL}login`,
            });
          }}
        >
          <LogoutCurve size='24' />
          <p className='ml-[22px] font-bold'>Log Out</p>
        </div>
      </div>
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppBar />

      <RenderDialog />
      {/* <RenderactionDialog /> */}
      {!viewStore.isMd ? (
        <div className='max-w-screen h-[calc(100vh-50px)] overflow-hidden'>{children}</div>
      ) : (
        <div className='max-w-screen h-[calc(100vh-76px)] overflow-hidden'>
          <div className='flex h-full relative'>
            <div
              className={`bg-[#EEF1F8] absolute h-screen  text-center  text-white z-19  ease-in-out transition-all 
            `}
              style={{
                width: `calc(100vw )`,
              }}
            ></div>
            <SideBar />
            <div className='flex flex-col flex-1'>
              <div
                className={`mt-[20px] overflow-auto rounded-t-[10px] mr-[20px] relative  h-[calc(100%_-_0px)] transition-width bg-[#FFF] `}
                style={{
                  width: `calc(100vw - 224px)`, //20+sidebar
                  boxShadow: "0px -10px 100px 0px rgba(0, 0, 0, 0.15)",
                }}
              >
                {children}
                {/* <Preview_Backdrop /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}

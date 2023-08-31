"use client";

import "../styles/globals.css";
import "@fontsource/bai-jamjuree";

import { useDialogStore, useViewStore } from "@/store/store";

import { Backdrop } from "@mui/material";
import FilterDrawer from "@/Components/filter_drawer";
import Head from "next/head";
import Preview_Backdrop from "@/Components/preview_backdrop";
import Providers from "./provider";
import RenderActionDialog from "@/Components/Dialog/actionDailog";
import RenderDialog from "@/Components/Dialog";
import RenderLoading from "@/Components/loading";
import RenderSnackbar from "@/Components/snackbar";
import { SessionProvider } from "next-auth/react";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //@ts-ignore
  // const session = await unstable_getServerSession(authOptions);
  // console.log(Providers);
  const viewStore = useViewStore();
  return (
    <html style={{ height: "100vh" }}>

      {/* <title> E-Workflow Portal</title> */}
      <body style={{ fontFamily: "Bai Jamjuree" }}>
        <Providers>
          {/* <> */}
          {children}
          <RenderLoading />
          <RenderSnackbar />

          <FilterDrawer />
          {/* need User */}
          {/* <RenderDialog /> */}
          <RenderActionDialog />

          <Preview_Backdrop />
        </Providers>
      </body>
    </html>
  );
}

"use client";

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { Button, Menu, MenuItem } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";

import Link from "next/link";
import MenuData from "./menuItem";
import React from "react";
import { Session } from "next-auth/core/types";
import SeverSession from "./sesverSession";
import Submenu from "./subMenu";
import { authOptions } from "pages/api/auth/[...nextauth]";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import { useUser } from "@/utils/apiFn";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  return (
    <div className="max-w-screen overflow-hidden">
      <div className="bg-[#1D336D] h-12 flex w-screen items-center">
        <h2 className="text-white mx-4">APP NAME & ICON</h2>
        {MenuData.map((menu) => {
          return (
            <Submenu key={menu.name} menuData={menu}></Submenu>
            // <Link
            //   className="hover:bg-red-500"
            //   key={menu.name}
            //   href={`/menu/${menu.url}`}
            // >
            //   {menu.name}
            // </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}

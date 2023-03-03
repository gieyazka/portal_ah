"use client";

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { signIn, signOut, useSession } from "next-auth/react";

import Link from "next/link";
import Menu from "./menuItem";
import { Session } from "next-auth/core/types";
import SeverSession from "./sesverSession";
import { authOptions } from "pages/api/auth/[...nextauth]";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import { useUser } from "@/utis/apiFn";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log(session);
  const [showSidebar, setShowSidebar] = useState(false);
  const sibebarOpen = {
    width: "24vw",
  };
  const sibebarClose = {
    width: "96px",
  };
  
  const user = useUser()
  
  return (
    <html>
      <head />
      <body>
        <div className="max-w-screen overflow-hidden">
          <div className="flex relative">
            <div
              className={`bg-red-500 absolute h-screen  text-center  text-white z-39  ease-in-out transition-width 
           
          
            `}
              style={{
                width: showSidebar ? sibebarOpen.width : sibebarClose.width,
              }}
            ></div>
            <div
              className={`bg-[#1D336D] h-screen  text-center relative text-white z-40  ease-in-out transition-width rounded-tr-3xl
           
          
            `}
              style={{
                width: showSidebar ? sibebarOpen.width : sibebarClose.width,
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
                  <AiOutlineMenuUnfold
                    size={24}
                    className="mx-auto mt-4 cursor-pointer  "
                    onClick={() => setShowSidebar(!showSidebar)}
                  />
                )}
              </div>

              <h3 className=" font-semibold text-white mt-12">
                <div className="flex flex-col">
                  {Menu.map((menu) => {
                    return (
                      <Link key={menu.name} href={`/menu/${menu.url}`}>
                        {menu.name}
                      </Link>
                    );
                  })}
                </div>
              </h3>
            </div>
            <div className="flex flex-col flex-1">
              <div className="bg-red-500 h-16 flex items-center">
                {user.data ? (
                  <div className="mx-4">{user.data.user.rule}</div>
                ) : (
                  <div className="mx-4">loading</div>
                )}
              </div>
         
              <div
                className={`overflow-auto   h-[calc(100vh_-_4rem)] transition-width bg-red-200`}
                style={{
                  width: showSidebar
                    ? `calc(100vw - ${sibebarOpen.width})`
                    : `calc(100vw - ${sibebarClose.width})`,
                }}
              >
                <div className="m-8 bg-violet-200">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

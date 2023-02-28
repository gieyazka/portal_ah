"use client";

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

import Menu from "./menuItem";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useState } from "react";

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
                {Menu.map((menu) => {
                  return <div key={menu.name}>{menu.name}</div>;
                })}
              </h3>
            </div>
            <div className="flex flex-col flex-1">
              <div className="bg-red-500 h-16 ">asdsajdgash</div>
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

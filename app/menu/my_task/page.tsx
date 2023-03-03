"use client";
// import UserData from "./userData";

import type { menuItem, subMenu } from "../../interface/interface";
import { usePathname, useRouter } from "next/navigation";

import menuData from "../menuItem";

export default function MyTask() {
  //  const router = useRouter ()
  // console.log(router);
  const pathName = usePathname();
  const splitPath = pathName ? pathName.split("/") : [];
  const lastPath = splitPath[splitPath.length - 1];

  const currentMenu: menuItem | undefined = menuData.find(
    (d) => d.url === lastPath
  );

  // console.log(window.location.pathname);

  return (
    <div>
      <div className="flex">
        {currentMenu?.subMenu?.map((submenu: subMenu) => {
          return <div className={`mx-2 px-2 py-2 hover:cursor-pointer bg-green-200`} key={submenu.name}>{submenu.name}</div>;
        })}
      </div>
    </div>
  );
}

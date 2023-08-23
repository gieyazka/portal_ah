import * as React from "react";

import { HambergerMenu, LogoutCurve, Timer } from "iconsax-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import Menu from "@mui/material/Menu";
import { MenuBook } from "@mui/icons-material";
import MenuData from "./menuItem";
import MenuItem from "@mui/material/MenuItem";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { SWRResponse } from "swr";
import Settings from "@mui/icons-material/Settings";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { signOut } from "next-auth/react";

export default function AccountMenu({
  lastPath,
  user,
}: {
  lastPath: string;
  user: SWRResponse<any>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log("MenuData", MenuData);
  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <HambergerMenu size="32" color="#D9DAE6" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          // elevation: 0,
          sx: {
            width: "290px",
            background: "#3B4778",
            overflow: "visible",
            boxShadow: "-4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
            // "& .MuiAvatar-root": {
            //   width: 32,
            //   height: 32,
            //   ml: -0.5,
            //   mr: 1,
            // },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "#3B4778",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        // transformOrigin={{ horizontal: "right", vertical: "top" }}
        // anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {MenuData.map((menu: any, index: number) => {
          return (
            <div key={menu.name}>
              <Typography
                component="p"
                className="text-lg text-[#D4E8FC] font-extrabold ml-6"
              >
                {" "}
                {menu.name}{" "}
              </Typography>
              {menu.subMenu.map((subMenu: any, index: number) => {
                let isSelect =
                  menu.url === lastPath &&
                  subMenu.url === searchParams.get("current");
                return (
                  <div
                    onClick={() => {
                      setAnchorEl(null);
                      router.push(`/menu/${menu.url}?current=${subMenu.url}`);
                    }}
                    key={subMenu.name}
                    style={{ borderRadius: "0px 10px 10px 0px" }}
                    className={`cursor-pointer py-[8px] 
                    pl-11 mr-5 mt-[6px] ${
                      isSelect
                        ? `bg-[#1976D2] text-[#FFF] `
                        : `hover:bg-[#1976D2] hover:opacity-60 hover:text-[#FFF]`
                    }  `}
                  >
                    <div
                      className={`w-full flex gap-2 items-center  ${
                        isSelect ? "text-white" : "text-[#B4B6CD]"
                      } `}
                    >
                      <Typography component="p" className="text-[16px]   ">
                        {subMenu.icon ? (
                          subMenu.icon({ isSelect })
                        ) : (
                          <MenuBook />
                        )}{" "}
                      </Typography>
                      <Typography component="p" className="font-semibold ">
                        {subMenu.name}
                      </Typography>
                    </div>
                  </div>
                );
              })}
              <hr className=" mx-[8px] my-[12px] h-[1px] bg-[#FFFFFF]" />
            </div>
          );
        })}
        <div className="flex my-4 justify-center gap-4 items-center">
          <Avatar
            alt="user"
            src="/assets/image-placeholder.jpg"
            sx={{ width: 56, height: 56 }}
          />
          <div>
            <Typography
              component="p"
              className="text-white font-semibold text-base"
            >
              {user.data?.user?.fullName}
            </Typography>
            <Typography
              component="p"
              className="text-[#D4E8FC] font-normal text-sm"
            >
              {user.data?.user?.username}
            </Typography>
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              setAnchorEl(null);
              signOut();
            }}
            className="bg-[#1976D2] mx-auto my-2 text-white text-lg font-semibold h-12 w-28 rounded-md flex items-center gap-2 justify-center"
          >
            <LogoutCurve size="18" color="#FFFF" /> Logout
          </button>
        </div>
      </Menu>
    </React.Fragment>
  );
}

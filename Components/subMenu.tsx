import { Button, Menu, MenuItem } from "@mui/material";
import { menuItem, subMenu, userData } from "@/types/next-auth";

import React from "react";
import { useRouter } from "next/navigation";

const SubMenu = (props: { menuData: menuItem }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event: any) {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }

  function handleClose() {
    setAnchorEl(null);
  }
  return (
    <>
      <Button
        aria-owns={anchorEl ? "simple-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        onMouseOver={handleClick}
        sx={{
          color: "white",
          marginX: "8px",
        }}
      >
        {props.menuData.name}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
      >
        {props.menuData.subMenu.map((subMenu: subMenu) => {
          return (
            <>
              <MenuItem
                key={subMenu.name}
                onClick={(e) => {
                  router.push(
                    `menu/${props.menuData.url}?current=${subMenu.url}`
                  );
                  handleClose();
                }}
              >
                {subMenu.name}
              </MenuItem>
            </>
          );
        })}
      </Menu>
    </>
  );
};
export default SubMenu;

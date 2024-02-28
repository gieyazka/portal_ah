import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Clear } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import { DialogContent } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Leave_Flow from "@/Components/Leave";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import { useViewStore } from "@/store/store";

export interface LeaveDialog {
  dialogState: {
    open: boolean;
    data: {};
  };
  handleClose: () => void;
}

export default function LeaveDialog(props: LeaveDialog) {
  const { dialogState, handleClose } = props;
  const { open, data } = dialogState;

  return (
    <Dialog
      className='z-50 font-[Bai Jamjuree] rounded-[10px]'
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "90vw",
            // maxWidth: "500px", // Set your width here
          },
        },
      }}
      maxWidth={false}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle className='flex justify-between'>
        {data?.task_id}
        <Clear
          className='ml-6 cursor-pointer text-4xl'
          onClick={() => {
            handleClose();
          }}
        />
      </DialogTitle>
      {open && (
        <DialogContent>
          <Leave_Flow task={data} />
        </DialogContent>
      )}
    </Dialog>
  );
}

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Check, Clear } from "@mui/icons-material";

import Leave_Flow from "./leaveflow";
import { SWRResponse } from "swr";
import _fn from "@/utils/common";
import { task } from "@/types/next-auth";

const RenderDialog = (props: {
  dialogState: { open: boolean; task: { [key: string]: any } | undefined };
  handleClose: any;
  descriptionElementRef: any;
  user: SWRResponse;
}) => {
  const { dialogState, handleClose, descriptionElementRef, user } = {
    ...props,
  };
  const { open, task } = { ...dialogState };
  return (
    <>
      {task !== undefined && (
        <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={open}
          onClose={handleClose}
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            <div className="flex justify-between">
              {task.task_id}
              <Clear className="ml-6 cursor-pointer" onClick={handleClose} />
            </div>
          </DialogTitle>
          <DialogContent dividers={true}>
            <CheckFlow task={task} />
          </DialogContent>
          {/* <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Subscribe</Button>
          </DialogActions> */}
        </Dialog>
      )}
    </>
  );
};

const CheckFlow = (props: { task: task }) => {
  const flowName = props.task.data.flowName;
  if (flowName === "leave_flow") {
    return <Leave_Flow task={props.task} />;
  } else {
    return <>Flow Unavailable</>;
  }
};

export default RenderDialog;

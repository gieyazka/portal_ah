import {
  Add,
  Check,
  Clear,
  PhotoCamera,
  PictureAsPdf,
} from "@mui/icons-material";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { fileData, task } from "@/types/next-auth";
import {
  useActionDialogStore,
  useDialogStore,
  usePreviewStore,
  useViewStore,
} from "@/store/store";

import ActionFlow from "./action_flow";
import CheckFlow from "./checkflow";
import Image from "next/image";
import Leave_Flow from "../Leave";
import React from "react";
import { SWRResponse } from "swr";
import _apiFn from "@/utils/apiFn";
import _fn from "@/utils/common";
import { useForm } from "react-hook-form";

const RenderDialog = (props: {
  // dialogState: { open: boolean; task: { [key: string]: any } | undefined };
  // handleClose: any;
  // descriptionElementRef: any;
  // user: SWRResponse;
}) => {
  const viewStore = useViewStore();
  const dialogStore = useDialogStore();
  const actionDialogStore = useActionDialogStore();
  const handleClose = dialogStore.onCloseDialog;
  const { open, task, type, swrResponse } = { ...dialogStore };
console.log('swrResponse 49',swrResponse)
  const user = _apiFn.useUser();
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm();

  register("file", { value: [] });

  const handleOpenSubDialog = (
    task: task,
    type: string | undefined,
    action: boolean,
    swrResponse: SWRResponse | undefined
  ) => {
    actionDialogStore.onOpenDialog({ task, type, action, swrResponse });
  };

  if (user.isLoading) {
    return <></>;
  }
  if (viewStore.isMd) {
    return (
      <>
        {task !== undefined && (
          <Dialog
            className="z-50 font-[Bai Jamjuree] rounded-[10px]"
            // fullWidth={true}
            // maxWidth={"lg"}
            sx={{
              "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                  width: "auto",
                  // maxWidth: "500px", // Set your width here
                },
              },
            }}
            maxWidth={false}
            open={open}
            onClose={() => {
              handleClose();
              reset();
            }}
            scroll={"paper"}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            {/* <DialogTitle id="scroll-dialog-title" className="bg-[#EEF1F8]"> */}
            <div className="flex justify-between  items-center py-2 px-4 bg-[#EEF1F8]">
              <Typography
                component="p"
                className="bg-[#1976D2] text-lg text-white px-[22px] py-[6px]  rounded-[10px]  font-semibold                                              "
              >
                {task.data.flowName === "leave_flow"
                  ? "E-Leave"
                  : task.data.flowName}
              </Typography>
              <Typography
                component="p"
                className="text-lg text-[#464C59]  rounded-[10px]  font-semibold                                              "
              >
                {`Doc. ID : ${task.task_id}`}
              </Typography>
              <Clear
                className="ml-6 cursor-pointer text-4xl"
                onClick={() => {
                  handleClose();
                  reset();
                }}
              />
            </div>
            {/* </DialogTitle> */}
            <DialogContent dividers={true}>
              {type === undefined ? (
                <CheckFlow task={task} />
              ) : (
                <>dddddddddddddddd</>
              )}
            </DialogContent>
            {_fn.checkCanAction(user.data, task) && (
              <DialogActions className="justify-center">
                <Button
                  variant="contained"
                  className={`bg-[#EB4242] text-white border-0 hover:bg-red-700 w-24 `}
                  onClick={() =>
                    handleOpenSubDialog(task, "approve", false, swrResponse)
                  }
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  className={`bg-[#86DC89] text-white hover:opacity-80 w-24`}
                  onClick={() =>
                    handleOpenSubDialog(task, "approve", true, swrResponse)
                  }
                >
                  Approve
                </Button>
              </DialogActions>
            )}
          </Dialog>
        )}
      </>
    );
  }
  //mobile
  return (
    <>
      {task !== undefined && (
        <Dialog
          className="z-50 font-[Bai Jamjuree] rounded-[10px]"
          fullWidth={true}
          // maxWidth={"lg"}
          maxWidth={false}
          open={open}
          onClose={() => {
            handleClose();
            reset();
          }}
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          {/* <DialogTitle id="scroll-dialog-title" className="bg-[#EEF1F8]"> */}
          <div className="flex justify-between  items-center py-2 px-4 bg-[#EEF1F8]">
            <Typography
              component="p"
              className="text-base text-[#464C59]  rounded-[10px]  font-semibold                                              "
            >
              {`Doc. ID : ${task.task_id}`}
            </Typography>
            <Clear
              className="ml-6 cursor-pointer text-4xl"
              onClick={() => {
                handleClose();
                reset();
              }}
            />
          </div>
          {/* </DialogTitle> */}
          <DialogContent className="p-2" dividers={true}>
            {type === undefined ? <CheckFlow task={task} /> : <>no Flow</>}
          </DialogContent>
          {_fn.checkCanAction(user.data, task) && (
            <DialogActions className="justify-center">
              <Button
                variant="outlined"
                className={`bg-[#EB4242] text-white border-0 hover:bg-red-700 w-24 `}
                onClick={() =>
                  handleOpenSubDialog(task, "approve", false, swrResponse)
                }
              >
                Reject
              </Button>
              <Button
                variant="contained"
                className={`bg-[#86DC89] text-white hover:opacity-80 w-24`}
                onClick={() =>
                  handleOpenSubDialog(task, "approve", true, swrResponse)
                }
              >
                Approve
              </Button>
            </DialogActions>
          )}
        </Dialog>
      )}
    </>
  );
};

export default RenderDialog;

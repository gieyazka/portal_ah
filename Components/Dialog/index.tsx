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
} from "@mui/material";
import { fileData, task } from "@/types/next-auth";
import { useDialogStore, usePreviewStore } from "@/store/store";

import ActionFlow from "./action_flow";
import CheckFlow from "./checkflow";
import Image from "next/image";
import Leave_Flow from "../leaveflow";
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
  const dialogStore = useDialogStore();
  const handleClose = dialogStore.onCloseDialog;
  const { open, task, type } = { ...dialogStore };
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
  const [subDialogState, setSubDialogState] = React.useState<{
    open: boolean;
    task: task | undefined;
    type?: string;
  }>({
    open: false,
    task: undefined,
    type: undefined,
  });

  register("file", { value: [] });
  const handleCloseSubialog = () => {
    setSubDialogState((prev) => {
      return { task: undefined, open: false, type: undefined };
    });
  };

  const handleOpenSubialog = (task: task, type: string | undefined) => {
    setSubDialogState((prev) => {
      return { task: task, open: true, type: type };
    });
  };
  const storePreview = usePreviewStore();

  const onSubmit = async (values: any) => {
    // console.log(values);

    const res = await _apiFn.actionJob(
      task,
      "approve",
      true,
      user.data,
      values
    );
    console.log(res);
  };
  const fileForm = watch("file") || [];
  const isAppOrRe = type === "approve" || type === "reject" ? true : false;
  const handlFileChange = (file: FileList | null) => {
    if (file) {
      Array.from(file).map(async (fileData: Blob) => {
        let newFileData: fileData = {
          file: fileData,
          type: fileData.type,
          name: fileData.name,
        };
        let cloneFile = getValues("file");
        cloneFile.push(newFileData);
        setValue("file", cloneFile);
      });
    }
  };

  return (
    <>
      {task !== undefined && (
        <Dialog
          className="z-50"
          fullWidth={true}
          maxWidth={"lg"}
          open={open}
          onClose={() => {
            handleClose();
            reset();
          }}
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            <div className="flex justify-between">
              {task.task_id}
              <Clear
                className="ml-6 cursor-pointer"
                onClick={() => {
                  handleClose();
                  reset();
                }}
              />
            </div>
          </DialogTitle>
          <DialogContent dividers={true}>
            {type === undefined ? (
              <CheckFlow task={task} />
            ) : isAppOrRe ? (
              <ActionFlow task={task} type={type} />
            ) : (
              <>dddddddddddddddd</>
            )}
          </DialogContent>
          {_fn.checkCanAction(user.data, task) && (
            <DialogActions>
              <Button
                variant="outlined"
                className={`border-red-500 text-red-500 hover:border-red-700 hover:text-red-700 hover:bg-red-200`}
                onClick={() => handleOpenSubialog(task, "reject")}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                className={`bg-[#1D336D] text-white hover:bg-blue-700 `}
                onClick={() => handleOpenSubialog(task, "approve")}
              >
                Approve
              </Button>
            </DialogActions>
          )}
        </Dialog>
      )}
      <Dialog
        className="z-50"
        // hideBackdrop // Disable the backdrop color/image
        // disableEnforceFocus // Let the user focus on elements outside the dialog
        open={subDialogState.open}
      >
        <DialogTitle id="scroll-dialog-title">
          <div className="flex justify-between">
            {subDialogState.type?.toUpperCase()}
            <Clear
              className="ml-6 cursor-pointer"
              onClick={handleCloseSubialog}
            />
          </div>
        </DialogTitle>
        <DialogContent dividers={true}>
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* register your input into the hook by invoking the "register" function */}
              <b>Remark :</b>
              <textarea
                rows={3}
                defaultValue="test"
                {...register("remark")}
                className="mt-2 py-2 pr-24 pl-2  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pt-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <div className="flex justify-between items-center">
                <b>File :</b>
                <div className="flex items-center">
                  {fileForm.length > 0 && (
                    <Button
                      startIcon={<Clear />}
                      variant="outlined"
                      size="small"
                      className={`mr-2 border-red-500 text-red-500 hover:border-red-700 hover:text-red-700 hover:bg-red-200`}
                      onClick={() => setValue("file", [])}
                    >
                      Clear All
                    </Button>
                  )}
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                  >
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={(e) => {
                        handlFileChange(e.target.files);
                      }}
                      accept="application/pdf, image/png, image/jpeg"
                    />
                    <Add />
                  </IconButton>
                </div>
              </div>
              <div className="flex flex-wrap mt-4">
                {fileForm.length > 0 &&
                  fileForm.map((fileData: fileData, index: number) => {
                    return (
                      <div
                        key={fileData.name + "_" + index}
                        className=" basis-1/4 px-2 py-2"
                      >
                        <div className="relative text-center h-16 w-16">
                          {fileData.type !== "application/pdf" ? (
                            <Image
                              onClick={() =>
                                storePreview.onShowBackDrop(
                                  fileData.file,
                                  "image"
                                )
                              }
                              src={URL.createObjectURL(fileData.file)}
                              layout="fill"
                              // width={96}
                              // height={128}
                              alt={""}
                            />
                          ) : (
                            <div
                              onClick={() => {
                                storePreview.onShowBackDrop(
                                  fileData.file,
                                  "pdf"
                                );
                              }}
                              className="flex items-center border-2 rounded-md h-full w-full border-[#1D336D] "
                            >
                              <PictureAsPdf className="flex-1  text-[#1D336D]  " />
                            </div>
                          )}
                          <Clear
                            onClick={() => {
                              setValue(
                                "file",
                                _fn.deleteImage(fileForm, index)
                              );
                            }}
                            className="cursor-pointer  border-2 rounded-full text-red-500  border-red-500 bg-white hover:bg-red-200 absolute -top-2 -right-2"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </form>
          </>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className={`border-red-500 text-red-500 hover:border-red-700 hover:text-red-700 hover:bg-red-200`}
            // onClick={() => handleOpenSubialog(task, "reject")}
          >
            Cancle
          </Button>
          <Button
            variant="contained"
            className={`bg-[#1D336D] text-white hover:bg-blue-700 `}
            onClick={handleSubmit(onSubmit)}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RenderDialog;

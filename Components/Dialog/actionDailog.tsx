import { Add, Check, Clear, PhotoCamera, PictureAsPdf } from "@mui/icons-material";
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { fileData, task } from "@/types/next-auth";
import { useActionDialogStore, useDialogStore, useFilterStore, useLoading, usePreviewStore, useSnackbarStore, useViewStore } from "@/store/store";

import ActionFlow from "./action_flow";
import CheckFlow from "./checkflow";
import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import Swal from "sweetalert2";
import _apiFn from "@/utils/apiFn";
import _fn from "@/utils/common";
import _outFlowActionApi from "@/utils/outFlow/api";
import fn from "@/utils/common";
import { useForm } from "react-hook-form";

const RenderSubDialog = (props: {
  // dialogState: { open: boolean; task: { [key: string]: any } | undefined };
  // handleClose: any;
  // descriptionElementRef: any;
  // user: SWRResponse;
}) => {
  const filterStore = useFilterStore();
  const user = _apiFn.useUser();
  const loadingStore = useLoading();
  const fileInput = React.useRef(null);
  const actionDialogStore = useActionDialogStore();
  const snackbarStore = useSnackbarStore();
  const { open, task, type } = { ...actionDialogStore };
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
  const handleCloseSubialog = () => {
    reset();
    actionDialogStore.onCloseDialog();
  };

  const dialogCheck = (type: string) => {
    Swal.fire({
      title: `Confirm ${type} request?`,
      text: ` ${task?.task_id}`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setValue("type", type.toLowerCase());
        await onSubmit(getValues());
        // handleSubmit(onSubmit);
      }
    });
  };
  const storePreview = usePreviewStore();
  const viewStore = useViewStore();
  const dialogStore = useDialogStore();

  // React.useMemo(() => {
  //   if (dialogStore.open && dialogStore.task !== undefined) {
  //     const selectedTask = actionDialogStore.swrResponse?.data.find((d: any) => d.task_id === dialogStore.task?.task_id);
  //     console.log("selectedTask", selectedTask);
  //     if (selectedTask === undefined) {
  //       dialogStore.onCloseDialog();
  //     } else {
  //       dialogStore.onReload({ task: selectedTask });
  //     }
  //   }
  // }, [actionDialogStore.open]);
  // console.log("77", actionDialogStore);

  const handleAfterAction = (data: task[]) => {
    if (dialogStore.open && dialogStore.task !== undefined) {
      const selectedTask = data.find((d: any) => d.task_id === dialogStore.task?.task_id);
      if (selectedTask === undefined) {
        dialogStore.onCloseDialog();
      } else {
        dialogStore.onReload({ task: selectedTask });
      }
    }
  };
  const onSubmit = async (values: any) => {
    // let newType = type;
    // if (values.type !== undefined) {
    // newType = values.type;
    // }
    // console.log("newType", newType);
    const isApprove = actionDialogStore.action || false;
    // loadingStore.setLoading(true);
    delete values.type;
    // console.log("101", isApprove);
    let res: AxiosResponse<any, any>;
    if (task?.data.isOutFlow) {
      res = (await _outFlowActionApi.actionOutFlow(task, user.data, isApprove, values)) as AxiosResponse<any, any>;
    } else {
      res = await _apiFn.actionJob(
        task,
        "approved",
        isApprove,

        user.data ?? undefined,
        values,
        actionDialogStore.email
      );
    }
    // return;
    let newType = isApprove ? "Approve" : "Reject";
    loadingStore.setLoading(false);
    if (res.status === 200) {
      await actionDialogStore.swrResponse?.mutate().then((d) => {
        handleAfterAction(d);
      });
      snackbarStore.showSnackBar({
        title: `${newType?.toUpperCase()} Success`,

        type: "success",
      });
      handleCloseSubialog();
      // filterStore.searchClick();
    } else {
      await actionDialogStore?.swrResponse?.mutate();

      snackbarStore.showSnackBar({
        title: `${newType?.toUpperCase()} Failed`,
        message: res.data.errors,
        type: "error",
      });
    }
  };

  const fileForm = watch("file") || [];
  const handlFileChange = (file: FileList | null) => {
    if (file) {
      Array.from(file).forEach(async (fileData: Blob) => {
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
    <Dialog
      className='z-50'
      // hideBackdrop // Disable the backdrop color/image
      // disableEnforceFocus // Let the user focus on elements outside the dialog
      open={open}
    >
      <DialogTitle
        className='bg-[#D4E8FC]'
        id='scroll-dialog-title'
      >
        <div className='flex justify-between items-center'>
          <Typography
            component='p'
            className='text-xl rounded-t-[10px] text-[#1976D2]  font-bold px-2'
          >
            Confirm : {actionDialogStore.action ? "Approve" : "Reject"}
            {/* Remark */}
          </Typography>
          <Clear
            className='ml-6 cursor-pointer'
            onClick={handleCloseSubialog}
          />
        </div>
      </DialogTitle>
      <DialogContent dividers={true}>
        <div>
          <form>
            <div className='flex gap-2'>
              <div>
                <textarea
                  disabled={task?.data?.notNeedRemark || false}
                  placeholder='Remark'
                  rows={3}
                  // defaultValue=""
                  {...register("remark")}
                  className=' py-2 pr-24 pl-2  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pt-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                />
              </div>
              <Button
                disabled={task?.data?.notNeedFile || false}
                onClick={() => {
                  if (fileInput.current) {
                    (fileInput.current as any).click();
                  }
                }}
                className='bg-[#D8D9DA]  text-center items-center flex px-4 rounded-xl cursor-pointer hover:opacity-80 flex-1'
              >
                <input
                  ref={fileInput}
                  type='file'
                  hidden
                  multiple
                  onChange={(e) => {
                    handlFileChange(e.target.files);
                  }}
                  // accept="application/pdf, image/png, image/jpeg"
                />
                <Typography
                  className={`whitespace-nowrap my-auto  ${viewStore.isMd && "text-xl"} text-[#818181] font-semibold`}
                  component='p'
                >
                  {viewStore.isMd ? "+ Attach file" : "+ File"}
                </Typography>
              </Button>
            </div>
            <div className='flex justify-between items-center'>
              <div className='flex justify-end flex-1 items-center mt-2'>
                {fileForm.length > 0 && (
                  <Button
                    startIcon={<Clear />}
                    variant='outlined'
                    size='small'
                    className={`mr-2 border-red-500 text-red-500 hover:border-red-700 hover:text-red-700 hover:bg-red-200`}
                    onClick={() => setValue("file", [])}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
            <div className='flex flex-wrap  '>
              {fileForm.length > 0 &&
                fileForm.map((fileData: fileData, index: number) => {
                  let checkFile = fileData.name?.includes(".pdf") ? "pdf" : fn.isImageFile(fileData.name as string) ? "image" : "file";

                  return (
                    <div
                      key={fileData.name + "_" + index}
                      className=' basis-1/4 px-2 py-2 mt-4'
                      onClick={async () => {
                        await fn.onPreviewFile(fileData.file, checkFile, storePreview);
                      }}
                    >
                      <div className='relative text-center h-16 w-16'>
                        {checkFile === "image" ? (
                          <div className='h-full w-full'>
                            <Image
                              src={URL.createObjectURL(fileData.file)}
                              // className='w-full h-full'
                              fill
                              style={{
                                objectFit: "contain",
                                objectPosition: "center",
                              }}
                              // width={60}
                              // height={60}
                              alt={""}
                            />
                          </div>
                        ) : checkFile === "pdf" ? (
                          <div className=' h-full w-full'>
                            <div className='flex items-center border-2 rounded-md h-full w-full border-[#1D336D] '>
                              <PictureAsPdf className='flex-1  text-[#1D336D]  ' />
                            </div>
                          </div>
                        ) : (
                          <div className=' h-full w-full'>
                            <div className='flex items-center border-2 rounded-md h-full w-full border-[#1D336D] '>
                              <DownloadIcon className='flex-1  text-[#1D336D]  ' />
                            </div>
                          </div>
                        )}
                        <Clear
                          onClick={() => {
                            setValue("file", _fn.deleteImage(fileForm, index));
                          }}
                          className='cursor-pointer  border-2 rounded-full text-red-500  border-red-500 bg-white hover:bg-red-200 absolute -top-2 -right-2'
                        />
                        <p className='mt-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis'>{fileData.name}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </form>
        </div>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        {type !== undefined ? (
          <>
            {user.isLoading ? (
              <LoadingButton />
            ) : (
              <Button
                className={`bg-[#EB4242] text-white hover:bg-red-700  `}
                onClick={() => handleCloseSubialog()}
              >
                Cancel
              </Button>
            )}
            {user.isLoading ? (
              <LoadingButton />
            ) : (
              <Button
                variant='contained'
                style={{
                  backgroundColor: "#86DC89",
                  // type?.toLowerCase() === "reject" ? "#FF5555" : "#86DC89",
                }}
                className={` text-white opacity-100  hover:opacity-70  `}
                onClick={async () => {
                  setValue("type", type.toLowerCase());
                  await onSubmit(getValues());
                  reset();
                }}
              >
                {/* {type?.toUpperCase()} */}
                Confirm
              </Button>
            )}
          </>
        ) : (
          <>
            {user.isLoading ? (
              <LoadingButton />
            ) : (
              <Button
                variant='outlined'
                className={` text-white opacity-100  hover:opacity-70  `}
                style={{
                  backgroundColor: "#FF5555",
                  borderColor: "#FF5555",
                }}
                onClick={() => {
                  dialogCheck("Reject");
                }}
              >
                Reject
              </Button>
            )}
            {user.isLoading ? (
              <LoadingButton />
            ) : (
              <Button
                variant='contained'
                className={` text-white opacity-100  hover:opacity-70  `}
                style={{
                  backgroundColor: "#86DC89",
                }}
                onClick={() => {
                  dialogCheck("Approve");
                }}
              >
                Approve
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RenderSubDialog;

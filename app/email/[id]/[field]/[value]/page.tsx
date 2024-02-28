"use client";

import {
  Add,
  Check,
  Clear,
  PhotoCamera,
  PictureAsPdf,
} from "@mui/icons-material";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { fileData, task } from "@/types/next-auth";
import {
  useActionDialogStore,
  useLoading,
  useSnackbarStore,
} from "@/store/store";
import { usePreviewStore, useViewStore } from "@/store/store";

import Leave from "@/Components/Leave/";
import Leave_FlowEmail from "@/Components/Leave/leaveflow_Email";
import _apiFn from "@/utils/apiFn";
import _fn from "@/utils/common";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

export default function EmailPage({ params }: { params: any }) {
  const theme = useTheme();
  const isMdCheck = useMediaQuery(theme.breakpoints.up("md"));
  useEffect(() => {
    viewStore.setMd(isMdCheck);
  }, [isMdCheck]);
  const viewStore = useViewStore();
  const loadingStore = useLoading();
  const type = params.field;
  const taskID = params.id;

  const isApprove = params.value === "true" ? true : false;
  const storePreview = usePreviewStore();
  const snackbarStore = useSnackbarStore();
  const actionDialogStore = useActionDialogStore();
  // const { open, task, type } = { ...actionDialogStore };
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
  const task = _apiFn.useTaskByItemID(taskID);
  const [openDialogstate, setOpenDialogState] = React.useState(false);
  const leaveDay = _apiFn.useLeaveDay(
    task.data?.data?.requester?.company,
    task.data?.data?.calendarProfile
  );

  const [backDropState, setBackDropState] = React.useState<{
    open: boolean;
    file: string | undefined;
    type: string | undefined;
  }>({
    open: false,
    file: undefined,
    type: undefined,
  });

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
  if (task.isLoading) {
    return <div>Loading...</div>;
  }
  const isAction =
    task?.data?.items.find((d: any) => d.id === taskID).status === "end";
  // if (task.data.items.find((d: any) => d.id === taskID).status === "end") {
  //   Swal.fire({
  //     position: "center",
  //     icon: "info",
  //     text: "This request is already Approved or Rejected",
  //     showConfirmButton: false,
  //     // timer: 1500
  //   });
  // }
  const getTileClassName = (props: {
    date: Date;
    leaveData: string[];
    activeStartDate: Date;
  }) => {
    const actveDate = dayjs(props.activeStartDate).format("MM");
    const monthLeave = leaveDay.data?.filter(
      (d: any) => dayjs(d.sdate, "YYYY-MM-DD").format("MM") === actveDate
    );

    const result: any = props.leaveData.find(
      (d: any) =>
        dayjs(d.date).format("YYYYMMDD") ===
        dayjs(props.date).format("YYYYMMDD")
    );

    if (result !== undefined) {
      if (result.active === true || result.active === undefined) {
        if (result.value === 1) {
          return "rounded-full py-3  relative bg-[#1976D2] text-white";
        } else if (result.value === 0.5) {
          return "text-white rounded-full  py-3 border border-[#1976D2] bg-[#1976D2] bg-opacity-50";
        }
      }
    } else {
      // return "rounded-full py-3  relative bg-[#FF5555] text-white";
    }
    if (monthLeave) {
      if (
        monthLeave.some(
          (d: { sdate: string }) =>
            d.sdate === dayjs(props.date).format("YYYY-MM-DD")
        )
      ) {
        return "text-[#EB4242] ";
      }
    }
    // return isWeekend(props.date) ? "text-white" : "";
  };
  return (
    <div className=" min-h-screen p-4">
      {/* <Leave_Flow task={task.data} />; */}
      {isAction && (
        <Alert severity="warning">
          This request is already Approved or Rejected
        </Alert>
      )}
      {/* <Backdrop
        sx={{ color: "#F2F2F", zIndex: 999 }}
        open={backDropState.open}
        onClick={() =>
          setBackDropState({ open: false, file: undefined, type: undefined })
        }
      >
        {backDropState.file !== undefined &&
          (backDropState.type === "image" ? (
            <Image
              src={backDropState?.file}
              layout="fill"
              objectFit="contain"
              alt={"showimage"}
            />
          ) : (
            <div className="w-[100vw] h-[100vh] text-center items-center">
              <div className="flex justify-end mr-2">
                <Clear className="cursor-pointer" />
              </div>
              <iframe
                className="mx-auto"
                src={backDropState.file + "#toolbar=0"}
                width="80%"
                height="100%"
              ></iframe>
            </div>
          ))}
      </Backdrop> */}
      <div className="p-4  h-[90vh]  overflow-auto">
        {task.data.data.flowName === "leave_flow" ? (
          <Leave task={task.data} />
        ) : (
          // <div className="h-full w-full">
          //   {viewStore.isMd ? (
          //     <div className="flex w-full h-full gap-2 my-2">
          //       <div className="w-1/2 ">
          //         <LeaveDetail
          //           task={task.data}
          //           storePreview={storePreview}
          //           leaveDaySwr={leaveDay}
          //         />
          //       </div>
          //       <div className="w-1/2 flex flex-col items-stretch gap-2 relative ">
          //         <div className="flex-grow relative ">
          //           <Requester requester={task?.data.data.requester} />
          //         </div>
          //         <div className="flex-grow relative">
          //           <FileAttach task={task.data} />
          //         </div>
          //       </div>
          //     </div>
          //   ) : (
          //     <div className="flex flex-col w-full h-full gap-2 my-2">
          //       <LeaveDetail
          //         task={task.data}
          //         storePreview={storePreview}
          //         leaveDaySwr={leaveDay}
          //       />
          //       <div className="h-full flex flex-col items-stretch gap-2 relative ">
          //         <div className="flex-grow relative ">
          //           <Requester requester={task?.data.data.requester} />
          //         </div>
          //         <div className="flex-grow relative">
          //           <FileAttach task={task.data} />
          //         </div>
          //       </div>
          //     </div>
          //   )}
          // </div>
          <></>
        )}
      </div>
      <div className="flex justify-center mt-4">
        {!isAction && (
          <Button
            variant="contained"
            style={{ backgroundColor: isApprove ? "#1D336D" : "#FF5555" }}
            className={` text-white `}
            onClick={() => {
              // setOpenDialogState(true)
              actionDialogStore.onOpenDialog({
                task: task.data,
                type,
                action: isApprove,
                swrResponse: task,
              });
            }}
          >
            {isApprove ? "Approve" : "Reject"}
          </Button>
        )}
      </div>
    </div>
  );
}

"use client";

import { Add, Check, Clear, PhotoCamera, PictureAsPdf } from "@mui/icons-material";
import { Alert, Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { fileData, task } from "@/types/next-auth";
import { useActionDialogStore, useLoading, useSnackbarStore } from "@/store/store";
import { usePreviewStore, useViewStore } from "@/store/store";

import Leave from "@/Components/Leave/";
import Leave_FlowEmail from "@/Components/Leave/leaveflow_Email";
import _ from "lodash";
import _apiFn from "@/utils/apiFn";
import _fn from "@/utils/common";
import dayjs from "dayjs";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function EmailPage({ params }: { params: any }) {
  const user = _apiFn.useUser();
  const theme = useTheme();
  const isMdCheck = useMediaQuery(theme.breakpoints.up("md"));
  useEffect(() => {
    viewStore.setMd(isMdCheck);
  }, [isMdCheck]);
  console.log("params", params);
  useEffect(() => {
    if (!user.isLoading && _.isEmpty(user.data)) {
      signIn("azure-ad-AH", {
        redirect: false,
        callbackUrl: "/email/0bd9fa0a-328a-4755-967a-aa9629df5769/approved/true/pornchai.p@aapico.com",
        // callbackUrl: "/menu/my_task?current=in_process",
      });
    }
  }, [user.isLoading]);
  const viewStore = useViewStore();
  const loadingStore = useLoading();
  const type = params.field;
  const taskID = params.id;
  console.log("", user?.data?.user?.email);
  const email = decodeURIComponent(params.email);

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

  const leaveDay = _apiFn.useLeaveDay(task.data?.data?.requester?.company, task.data?.data?.calendarProfile);
  if (task.isLoading) {
    return <div>Loading...</div>;
  }

  const isAction = task?.data?.items?.find((d: any) => d.id === taskID).status === "end";
  // console.log("7979779", task.data.data.requester.company);

  return (
    <div className=' min-h-screen p-4'>
      {/* <Leave_Flow task={task.data} />; */}
      {isAction && <Alert severity='warning'>This request is already Approved or Rejected</Alert>}
      <Alert
        className='bg-[#1D336D] text-white mb-2 justify-center text-lg'
        icon={false}
      >
        {task.data.task_id}
      </Alert>

      <div className='p-4  h-[90vh]  overflow-auto'>{task.data.data.flowName === "leave_flow" ? <Leave task={task.data} /> : <></>}</div>
      <div className='flex justify-center mt-4'>
        {!isAction && (
          <Button
            variant='contained'
            style={{ backgroundColor: isApprove ? "#1D336D" : "#FF5555" }}
            className={` text-white `}
            onClick={() => {
              // setOpenDialogState(true)
              actionDialogStore.onOpenDialog({
                email: email,
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

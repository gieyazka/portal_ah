import { previewStore, task } from "@/types/next-auth";
import { useEffect, useMemo } from "react";
import { useLoading, usePreviewStore, useViewStore } from "@/store/store";

import ActionLog from "../Action_log/";
import ApproverStep from "../approver_step";
import ApproverStepMobile from "../approver_step_Mobile";
import FileAttach from "../FileAttached/";
import Image from "next/image";
import LeaveDetail from "./leaveflow";
import LeaveDetailMobile from "./leaveflow_Mobile";
import LeaveHistory from "./history";
import { PictureAsPdf } from "@mui/icons-material";
import Requester from "../requester/requester";
import RequesterMobile from "../requester/requester_mobile";
import _apiFn from "@/utils/apiFn";
import dayjs from "dayjs";

const Leave_Flow = (props: { task: task }) => {
  const viewStore = useViewStore();
  const storePreview = usePreviewStore();
  const loadingStore = useLoading();
  const findCurrentTask = _apiFn.useTaskByTaskID(props.task.task_id);
  useEffect(() => {
    findCurrentTask.mutate();
  }, [props.task]);
  const task = findCurrentTask.data;
  const leaveQuota = _apiFn.useLeaveQuota({
    empID: props.task.data.requester.empid,
    date: props.task.data.leaveData[0].date,
  });
  useEffect(() => {
    if (findCurrentTask.isLoading || leaveQuota.isLoading) {
      loadingStore.setLoading(true);
    } else {
      loadingStore.setLoading(false);
    }
  }, [findCurrentTask.isLoading, leaveQuota.isLoading]);
  const getTileClassName = (props: {
    date: Date;
    leaveData: string[];
    activeStartDate: Date;
  }) => {
    const actveDate = dayjs(props.activeStartDate).format("MM");
    // const monthLeave = leaveDay.data?.filter(
    //   (d: any) => dayjs(d.sdate, "YYYY-MM-DD").format("MM") === actveDate
    // );

    const result: any = props.leaveData.find(
      (d: any) =>
        dayjs(d.date).format("YYYYMMDD") ===
        dayjs(props.date).format("YYYYMMDD")
    );

    if (result !== undefined) {
      if (result.active === true || result.active === undefined) {
        if (result.value == 1) {
          return "rounded-full py-3  relative bg-[#1976D2] text-white";
        } else if (result.value == 0.5) {
          return "text-white rounded-full  py-3 border border-[#1976D2] bg-[#1976D2] bg-opacity-50";
        }
      }
    } else {
      // return "rounded-full py-3  relative bg-[#FF5555] text-white";
    }
    // if (monthLeave) {
    //   if (
    //     monthLeave.some(
    //       (d: { sdate: string }) =>
    //         d.sdate === dayjs(props.date).format("YYYY-MM-DD")
    //     )
    //   ) {
    //     return "text-[#EB4242] ";
    //   }
    // }
    // return isWeekend(props.date) ? "text-white" : "";
  };
  if (findCurrentTask.isLoading) {
    return <></>;
  }
  if (viewStore.isMd) {
    return (
      <div className="w-full">
        <ApproverStep task={task} />
        <div className="flex w-full h-full gap-2 my-2">
          <div className="w-[50%]">
            <LeaveDetail
              getTileClassName={getTileClassName}
              task={task}
              storePreview={storePreview}
            />
          </div>
          <div className="flex-1 flex flex-col items-stretch gap-2 relative ">
            <div className="flex-grow relative ">
              <Requester task={task} requester={task?.data.requester} />
            </div>
            <div className="flex-grow relative">
              <FileAttach task={task} />
            </div>
          </div>
        </div>
        <LeaveHistory task={task} leaveQuota={leaveQuota.data} />
        <ActionLog actionLog={task.data.actionLog} />
      </div>
    );
  } else {
    return (
      <div className="h-full w-full flex flex-col gap-3">
        <RequesterMobile task={task} requester={task.data.requester} />
        <LeaveDetailMobile
          getTileClassName={getTileClassName}
          task={task}
          storePreview={storePreview}
        />
        <FileAttach task={task} />
        <ApproverStep task={task} />
        <ActionLog actionLog={task.data.actionLog} />
      </div>
    );
  }
};

export default Leave_Flow;

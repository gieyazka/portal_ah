import { previewStore, task } from "@/types/next-auth";
import { usePreviewStore, useViewStore } from "@/store/store";

import Action_log from "../Action_log/action_log";
import Action_log_Mobile from "../Action_log/action_log_Mobile";
import ApproverStep from "../approver_step";
import ApproverStepMobile from "../approver_step_Mobile";
import FileAttach from "../fileAttached";
import FileAttachMobile from "../fileAttached_Mobile";
import Image from "next/image";
import LeaveDetail from "./leaveflow";
import LeaveDetailMobile from "./leaveflow_Mobile";
import { PictureAsPdf } from "@mui/icons-material";
import Requester from "../requester/requester";
import RequesterMobile from "../requester/requester_mobile";
import _apiFn from "@/utils/apiFn";
import dayjs from "dayjs";

const Leave_Flow = (props: { task: task }) => {
  const task = props.task;
  const viewStore = useViewStore();
  const storePreview = usePreviewStore();
  const leaveDay = _apiFn.useLeaveDay(
    task.data.requester.company,
    task.data.calendarProfile
  );

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

  if (viewStore.isMd) {
    return (
      <div className="">
        <ApproverStep task={task} />
        <div className="flex w-full h-full gap-2 my-2">
          <div className=" ">
            <LeaveDetail
              getTileClassName={getTileClassName}
              task={task}
              storePreview={storePreview}
              leaveDaySwr={leaveDay}
            />
          </div>
          <div className="w-1/2 flex flex-col items-stretch gap-2 relative ">
            <div className="flex-grow relative ">
              <Requester requester={task?.data.requester} />
            </div>
            <div className="flex-grow relative">
              <FileAttach task={task} />
            </div>
          </div>
        </div>
        <Action_log actionLog={task.data.actionLog} />
      </div>
    );
  } else {
    return (
      <div className="h-full w-full flex flex-col gap-3">
        <RequesterMobile requester={task?.data.requester} />
        <LeaveDetailMobile
          getTileClassName={getTileClassName}
          task={task}
          storePreview={storePreview}
          leaveDaySwr={leaveDay}
        />
        <FileAttachMobile task={task} />
        <ApproverStep task={task} />
        <Action_log_Mobile actionLog={task.data.actionLog} />
      </div>
    );
  }
};

export default Leave_Flow;

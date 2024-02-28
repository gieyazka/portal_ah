import { previewStore, task } from "@/types/next-auth";
import { usePreviewStore, useViewStore } from "@/store/store";

import ApproverStepMobile from "../approver_step_Mobile";
import FileAttach from "../FileAttached/";
import Image from "next/image";
import LeaveDetail from "./leaveflow";
import LeaveDetailMobile from "./leaveflow_Mobile";
import { PictureAsPdf } from "@mui/icons-material";
import Requester from "../requester/requester";
import RequesterMobile from "../requester/requester_mobile";
import _apiFn from "@/utils/apiFn";

const Leave_Flow = (props: {
  task: task;
  getTileClassName: (props: {
    date: Date;
    leaveData: string[];
    activeStartDate: Date;
  }) => string | undefined;
}) => {
  const getTileClassName = props.getTileClassName;
  const task = props.task;
  const viewStore = useViewStore();
  const storePreview = usePreviewStore();
  const leaveDay = _apiFn.useLeaveDay(
    task.data.requester.company,
    task.data.calendarProfile
  );

  if (viewStore.isMd) {
    return (
      <div className="">
        <div className="flex w-full h-full gap-2 my-2">
          <div className="w-1/2 ">
            <LeaveDetail
              getTileClassName={getTileClassName}
              task={task}
              storePreview={storePreview}
              leaveDaySwr={leaveDay}
            />
          </div>
          <div className="w-1/2 flex flex-col items-stretch gap-2 relative ">
            <div className="flex-grow relative ">
              <Requester task={task} requester={task?.data.requester} />
            </div>
            <div className="flex-grow relative">
              <FileAttach task={task} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full w-full flex flex-col gap-3">
        <RequesterMobile task={task} requester={task.data.requester}  />
        <LeaveDetailMobile
          getTileClassName={getTileClassName}
          task={task}
          storePreview={storePreview}
          // leaveDaySwr={leaveDay}
        />
        <FileAttach task={task} />
      </div>
    );
  }
};

export default Leave_Flow;

import { previewStore, task } from "@/types/next-auth";
import { usePreviewStore, useViewStore } from "@/store/store";

import Action_log from "../Action_log/";
import ApproverStep from "../approver_step";
import ApproverStepMobile from "../approver_step_Mobile";
import FileAttach from "../FileAttached/";
import Image from "next/image";
import { PictureAsPdf } from "@mui/icons-material";
import Requester from "../requester/requester";
import RequesterMobile from "../requester/requester_mobile";
import _apiFn from "@/utils/apiFn";
import dayjs from "dayjs";

const Carbooking = (props: { task: task }) => {
  const task = props.task;
  const viewStore = useViewStore();
  const storePreview = usePreviewStore();
  if (viewStore.isMd) {
    return (
      <div className="">
        {/* <ApproverStep task={task} /> */}
        <div className="flex w-full h-full gap-2 my-2">
          <div className="w-full">
            {/* <LeaveDetail
              getTileClassName={getTileClassName}
              task={task}
              storePreview={storePreview}
              leaveDaySwr={leaveDay}
            /> */}
          </div>
          <div className="w-1/2 flex flex-col items-stretch gap-2 relative ">
            <div className="flex-grow relative ">
              <Requester requester={task?.data.requester} />
            </div>
            <div className="flex-grow relative">
              {/* <FileAttach task={task} /> */}
            </div>
          </div>
        </div>
        {/* <Action_log actionLog={task.data.actionLog} /> */}
      </div>
    );
  } else {
    return (
      <div className="h-full w-full flex flex-col gap-3">
        <RequesterMobile requester={task?.data.requester} />
      </div>
    );
  }
};

export default Carbooking;

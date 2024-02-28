import { previewStore, requester, task } from "@/types/next-auth";
import { useMemo, useState } from "react";
import { usePreviewStore, useViewStore } from "@/store/store";

import ActionLog from "../Action_log";
import Action_log from "@/Components/Action_log/";
import ApproverStep from "@/Components/outFlow/approverStep/approver_step";
import ApproverStepMobile from "../approver_step_Mobile";
import Detail from "./detail";
import FileAttach from "../FileAttached";
import Image from "next/image";
import { PictureAsPdf } from "@mui/icons-material";
import Requester from "../requester/requester";
import RequesterMobile from "../requester/requester_mobile";
import _apiFn from "@/utils/apiFn";
import axios from "axios";
import dayjs from "dayjs";
import fn from "@/utils/common";
import { useQuery } from "react-query";

const EGatePass = (props: { task: task }) => {
  const task = props.task;
  const viewStore = useViewStore();
  const storePreview = usePreviewStore();
  // console.log("task", task);
  const query = useQuery(["userPayroll", task.data.requester.empid], () => _apiFn.getUserInfo(task.data.requester.empid), {
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: task.data.flowName !== "leave_flow",
  });
  const requester: requester = useMemo(() => {
    if (query.data) {
      const employeeData = query.data?.employee;

      return { ...task.data.requester, ...fn.genRequester(employeeData) };
    } else {
      return task.data.requester;
    }
  }, [query.data]);
  if (viewStore.isMd) {
    return (
      <div className='w-full'>
        <ApproverStep
          task={task}
          requester={requester}
        />
        <div className='flex w-full h-full gap-2 my-2'>
          <div className='w-[55%]'>
            <Detail task={task} />
          </div>
          <div className='flex-1 flex flex-col  gap-2   relative '>
            <div className=' h-full'>
              <Requester
                task={task}
                requester={requester}
              />
            </div>
          </div>
        </div>

        <ActionLog actionLog={task.data.actionLog} />
      </div>
    );
  } else {
    return (
      <div className='h-full w-full flex flex-col gap-3'>
        <RequesterMobile
          task={task}
          requester={requester}
          // requester={requester}
        />
        <Detail task={task} />
        <ApproverStep
          task={task}
          requester={requester}
        />
        <ActionLog actionLog={task.data.actionLog} />
      </div>
    );
  }
};

export default EGatePass;

import Action_log from "./action_log";
import ApproverStep from "./approver_step";
import Requester from "./requester";
import dayjs from "dayjs";
import { task } from "@/types/next-auth";

const Leave_Flow = (props: { task: task }) => {
  const task = props.task;
  console.log(task);
  // console.log(dayjs().startOf('day').toISOString());

  return (
    <div>
      <ApproverStep task={task} />
      <LeaveDetail task={task} />
      <Requester requester={task.data.requester} />
      <Action_log approverList={task.data.approverList} />
    </div>
  );
};

const LeaveDetail = (props: { task: task }) => {
  const task: task = props.task;

  return (
    <div className="px-4 pt-3 pb-2 w-full ">
      <div className=" border-2 border-[#1D336D] rounded-lg p-2 relative">
        <p className="text-xl absolute -top-2 -translate-y-2 font-bold bg-white px-2">
          E Leave
        </p>
        <div className=" flex mt-2 mx-4 flex-col">
          <div className="flex   ">
            <p className="basis-1/3">
              <b>From :</b> {dayjs(task.data.from).format("DD/MM/YYYY")}{" "}
            </p>
            <p className="basis-1/3">
              <b>To :</b> {dayjs(task.data.to).format("DD/MM/YYYY")}
            </p>

            <p className="basis-1/3 text-end">
              <b>Issue Date :</b>{" "}
              {dayjs(task.startedAt).format("DD/MM/YYYY HH:mm:ss")}
            </p>
          </div>
          <div className="flex    ">
            <p className="basis-1/3">
              <b>Amount:</b> {task.data.amount} Days
            </p>
            <p>
              <b>Type :</b> {task.data.type}
            </p>
          </div>
          <hr className="my-2" />
          <div className="flex flex-col ">
            <p>
              <b>Reason</b> :{" "}
            </p>
            <p>{task.data.reason}</p>
          </div>
          <hr className="my-2" />
          <div className="flex flex-col ">
            <p>
              <b>File</b> :{" "}
            </p>
            <p>ยังไม่มีจ้า</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave_Flow;

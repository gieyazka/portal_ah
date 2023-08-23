import { requester, task } from "@/types/next-auth";

import ApproverStep from "./approver_step";
import dayjs from "dayjs";

const Requester = (props: { requester: requester }) => {
  const requester = props.requester;
  return (
    <div className="md:px-4 pt-3 pb-2 w-full ">
      <div className=" border-2 border-[#1D336D] rounded-lg p-2 relative">
        <p className="text-xl absolute -top-2 -translate-y-2 font-bold bg-white px-2">
          Requester
        </p>
        <div className=" flex flex-col md:flex-row mt-2 md:mx-4 ">
          <div className="flex flex-col justify-center basis-3/5 ">
            <p>
              <b>Name :</b> {requester.name}
            </p>
            <p>
              <b>Employee ID :</b> {requester.empid}
            </p>
            <p>
              <b>Position :</b> {requester.position}
            </p>
          </div>
          <div className="flex flex-col ">
            <p>
              <b>Company :</b> {requester.company}
            </p>
            <p>
              <b>Department :</b> {requester.department}
            </p>
            <p>
              <b>Section :</b> {requester.section}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requester;

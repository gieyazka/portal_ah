import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Typography,
} from "@mui/material";
import { Clear, Done, ExpandMore } from "@mui/icons-material";

import { approverList } from "@/types/next-auth";
import dayjs from "dayjs";

const Action_log = (props: { approverList: approverList[] | undefined }) => {
  const approverList = props.approverList;
  console.log(approverList);
  if (approverList === undefined) {
    return <></>;
  }
  return (
    <div className="px-4 pt-3 pb-2 w-full ">
      <div className=" border-2 border-[#1D336D] rounded-lg p-2 relative">
        <p className="text-xl absolute -top-2 -translate-y-2 font-bold bg-white px-2">
          Action Log
        </p>
        <Accordion className="mt-4 mx-2" expanded={false}>
          <AccordionSummary expandIcon={<div className="w-6" />}>
            <div className="  flex justify-between w-full text-center">
              <div className="basis-1/5 flex-grow">No.</div>
              <div className="basis-1/5 flex-grow">Name</div>
              <div className="basis-1/5 flex-grow">Action</div>
              <div className="basis-1/5 flex-grow">Action Date</div>
              <div className="basis-1/5 flex-grow">Note</div>
            </div>
          </AccordionSummary>
        </Accordion>
        {approverList.map((approverData: approverList, index: number) => {
          return (
            <Accordion key={approverData.name} className=" mt-4 mx-2 ">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <div className="flex justify-between w-full text-center">
                  <div className="basis-1/5 flex-grow">{index + 1}</div>
                  <div className="basis-1/5 flex-grow">{approverData.name}</div>
                  <div className="basis-1/5 flex-grow">
                    {approverData.action && (
                      <Chip
                        label={approverData.action}
                        icon={
                          approverData.action === "Approved" ? (
                            <Done />
                          ) : (
                            <Clear />
                          )
                        }
                        color={
                          approverData.action === "Approved"
                            ? "success"
                            : "error"
                        }
                      />
                    )}
                  </div>
                  <div className="basis-1/5 flex-grow">
                    {dayjs(approverData.date).format("DD/MM/YYYY HH:mm")}
                  </div>
                  <div className="basis-1/5 flex-grow">
                    {approverData.note && approverData.note.length > 30
                      ? approverData.note?.slice(0, 27) + "..."
                      : approverData.note}
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex">
                  <div className="flex flex-col justify-center basis-3/5 ">
                    <p>
                      <b>Position :</b> {approverData.position}
                    </p>
                    <p>
                      <b>Employee ID :</b> {approverData.empid}
                    </p>
                    <p>
                      <b>Email :</b> {approverData.email}
                    </p>
                  </div>
                  <div className="flex flex-col ">
                    <p>
                      <b>Company :</b> {approverData.company}
                    </p>
                    <p>
                      <b>Department :</b> {approverData.department}
                    </p>
                    <p>
                      <b>Section :</b> {approverData.section}
                    </p>
                    {approverData.sub_section && (
                      <p>
                        <b>Sub Section :</b> {approverData.sub_section}
                      </p>
                    )}
                  </div>
                  <hr className="my-2" />
                  <div className="flex flex-col ">
                    <p>
                      <b>Reason</b> :{" "}
                    </p>
                    <p>{approverData.note}</p>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default Action_log;

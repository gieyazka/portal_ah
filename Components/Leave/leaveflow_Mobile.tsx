// import "react-calendar/dist/Calendar.css";

import "dayjs/locale/th";
import "./calendar.css";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { ExpandMore, PictureAsPdf } from "@mui/icons-material";
import { previewStore, task } from "@/types/next-auth";

import Calendar from "react-calendar";
import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import React from "react";
import { SWRResponse } from "swr";
import _ from "lodash";
import axios from "axios";
import dayjs from "dayjs";
import fn from "@/utils/common";
import { useLoading } from "@/store/store";

// import {use}
// dayjs.locale("th");
const LeaveDetail = (props: {
  getTileClassName: (props: {
    date: Date;
    leaveData: string[];
    activeStartDate: Date;
  }) => string | undefined;
  task: task;
  storePreview: previewStore;
}) => {
  const [calendarMonth, setCalendarMonth] = React.useState(dayjs());
  const task: task = props.task;
  const getTileClassName = props.getTileClassName;
  const storePreview: previewStore = props.storePreview;
  const loadingStore = useLoading();
  const [value, onChange] = React.useState(new Date());

  const uniqMonth: string[] = _.uniq(
    task.data?.leaveData?.map((d: { date: Date }) => dayjs(d.date).format("MM"))
  );
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0; // Return true if it's a Sunday (0)
  };

  return (
    <div className="  w-full h-full relative">
      <div
        className=" rounded-[10px] relative h-full   flex flex-col bg-white "
        style={{
          boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            sx={{
              minHeight: 44,
              maxHeight: 44,
              "&.Mui-expanded": {
                minHeight: 44,
                maxHeight: 44,
              },
            }}
            className="p-0 bg-[#D4E8FC]  rounded-t-[10px]"
            expandIcon={<ExpandMore />}
          >
            <Typography
              component="p"
              className="text-xl  py-2  text-[#1976D2]  font-bold px-2"
            >
              Detail
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="p-0">
            <div className="flex flex-col gap-3 flex-1 py-2  ">
              <div
                // className="border-2 border-black w-fit"
                className=" w-fit mx-auto "
                // key={month as React.Key}
              >
                {/* <p className=" text-center  bg-[#FFFFFF] ">
                      {dayjs(month, "MM").format("MMMM")}
                    </p> */}
                <Calendar
                  locale={"en"}
                  defaultValue={
                    task.data.leaveData &&
                    (_.first(task.data.leaveData) as any).date
                  }
                  onActiveStartDateChange={({
                    action,
                    activeStartDate,
                    value,
                    view,
                  }) => {
                    setCalendarMonth(dayjs(activeStartDate));
                  }}
                  next2Label={null}
                  prev2Label={null}
                  view="month"
                  onClickDay={(v, e) => {}}
                  tileClassName={(props) =>
                    getTileClassName({
                      leaveData: task.data.leaveData,
                      ...props,
                    })
                  }
                  // value={leaveArr}
                />
              </div>
              <div className="flex flex-col mx-10 justify-center">
                <Typography
                  className="text-[#1D366D] font-semibold  text-lg "
                  component="p"
                >
                  Type :{" "}
                  <Typography
                    className="text-[#464C59]  font-medium  text-lg "
                    component="span"
                  >
                    {task.data.type.label}
                  </Typography>
                </Typography>

                <Typography
                  className="text-[#1D366D] font-semibold  "
                  component="p"
                >
                  Total :{" "}
                  <Typography
                    className="text-[#464C59] underline  font-medium "
                    component="span"
                  >
                    {task.data.amount} Day
                  </Typography>
                </Typography>
                <Typography
                  className="text-[#EB4242] whitespace-nowrap font-semibold text-lg "
                  component="p"
                >
                  Leave Date : {fn.renderLeaveData(task.data.leaveData)}
                </Typography>
                <Typography
                  className="text-[#1D366D] font-semibold  "
                  component="p"
                >
                  Issue Date :{" "}
                  <Typography
                    className="text-[#464C59]  font-medium "
                    component="span"
                  >
                    {dayjs(task.issueDate).format("DD/MM/YYYY")}
                  </Typography>
                </Typography>
                <Typography
                  className="text-[#1D366D] font-semibold  "
                  component="p"
                >
                  Issue Time :{" "}
                  <Typography
                    className="text-[#464C59]  font-medium "
                    component="span"
                  >
                    {dayjs(task.issueDate).format("HH:mm:ss")}
                  </Typography>
                </Typography>
                <Typography
                  className="text-[#1D366D] font-semibold  "
                  component="p"
                >
                  Reason :{" "}
                  <Typography
                    className="text-[#464C59]  font-medium "
                    component="span"
                  >
                    {task.data.reason}
                  </Typography>
                </Typography>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};
export default LeaveDetail;

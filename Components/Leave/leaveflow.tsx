// import "react-calendar/dist/Calendar.css";

import "dayjs/locale/th";
import "./calendar.css";

import { previewStore, task } from "@/types/next-auth";

import Calendar from "react-calendar";
import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import { PictureAsPdf } from "@mui/icons-material";
import React from "react";
import { SWRResponse } from "swr";
import { Typography } from "@mui/material";
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
  const getTileClassName = props.getTileClassName;
  const [calendarMonth, setCalendarMonth] = React.useState(dayjs());
  const task: task = props.task;
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
    <div className="  w-full h-full relative ">
      <div
        className=" rounded-[10px] relative h-full   flex flex-col bg-white "
        style={{
          boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography
          component="p"
          className="text-xl bg-[#D4E8FC] py-2 rounded-t-[10px] text-[#1976D2]  font-bold px-2"
        >
          Detail
        </Typography>

        <div className="flex flex-col flex-1 p-4 overflow-y-auto px-4   ">
          <div className=" flex gap-4 justify-center     ">
            <div className=" m-2 flex flex-col  items-center md:flex-row justify-center ">
              <div
                // className="border-2 border-black w-fit"
                className=" w-[350px] mx-auto "
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
                  // className=" text-sm h-auto border-0"
                  // showNavigation={false}
                  // activeStartDate={dayjs(month, "MM").toDate()}
                  // onChange={onChange}
                  // minDate={dayjs(month, "MM").startOf("month").toDate()}
                  // maxDate={dayjs(month, "MM").endOf("month").toDate()}
                  // tileDisabled={({date}) => date.getDate()===date1}
                  // nextLabel={null}
                  // prevLabel={null}
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
            </div>
            <div className="flex flex-col basis-2/5 justify-center">
              <Typography
                className="text-[#1D366D] whitespace-nowrap font-bold text-xl "
                component="p"
              >
                Type :{" "}
                <Typography
                  className="text-[#464C59]  whitespace-nowrap text-xl font-medium "
                  component="span"
                >
                  {task.data.type.label}
                </Typography>
              </Typography>
              <Typography
                className="text-[#1D366D] whitespace-nowrap font-semibold text-lg "
                component="p"
              >
                Total :{" "}
                <Typography
                  className="text-[#464C59] underline whitespace-nowrap text-lg font-medium "
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
                className="text-[#1D366D] whitespace-nowrap font-semibold text-lg "
                component="p"
              >
                Issue Date :{" "}
                <Typography
                  className="text-[#464C59] text-lg font-medium "
                  component="span"
                >
                  {dayjs(task.issueDate).format("DD/MM/YYYY")}
                </Typography>
              </Typography>

              <Typography
                className="text-[#1D366D] whitespace-nowrap font-semibold text-lg "
                component="p"
              >
                Issue Time :{" "}
                <Typography
                  className="text-[#464C59] text-lg font-medium "
                  component="span"
                >
                  {dayjs(task.issueDate).format("HH:mm:ss")}
                </Typography>
              </Typography>
              <Typography
                className="text-[#1D366D] font-semibold text-lg "
                component="p"
              >
                Reason :{" "}
                <Typography
                  className="text-[#464C59] text-lg font-medium "
                  component="span"
                >
                  {task.data.reason}
                </Typography>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeaveDetail;

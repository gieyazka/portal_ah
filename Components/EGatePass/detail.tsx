import Calendar from "react-calendar";
import React from "react";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import fn from "@/utils/common";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { task } from "@/types/next-auth";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
const getTileClassName = (props: { date: Date; startDate: string; endDate: string; activeStartDate: Date }) => {
  const startDate = dayjs(props.startDate, "YYYYMMDD");
  const endDate = dayjs(props.endDate, "YYYYMMDD");
  if (dayjs(props.date).isSameOrBefore(endDate) && dayjs(props.date).isSameOrAfter(startDate)) {
    return "rounded-full py-3  relative bg-[#1976D2] text-white";
  } else {
    // return "rounded-full py-3  relative bg-[#FF5555] text-white";
  }
};
const Detail = (props: { task: task }) => {
  const { task } = props;
  return (
    <div className='  w-full h-full relative '>
      <div
        className=' rounded-[10px] relative h-full   flex flex-col bg-white '
        style={{
          boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography
          component='p'
          className='text-xl bg-[#D4E8FC] py-2 rounded-t-[10px] text-[#1976D2]  font-bold px-2'
        >
          Detail
        </Typography>

        <div className='flex flex-col flex-1 p-4 overflow-y-auto px-4   '>
          <div className=' flex flex-col md:flex-row  gap-4 justify-center     '>
            <div className=' m-2 flex flex-col  items-center md:flex-row justify-center '>
              <div
                // className="border-2 border-black w-fit"
                className=' w-[350px] mx-auto '
                // key={month as React.Key}
              >
                {/* <p className=" text-center  bg-[#FFFFFF] ">
                  {dayjs(month, "MM").format("MMMM")}
                </p> */}
                <Calendar
                  locale={"en"}
                  defaultValue={dayjs(task.data.date, "YYYYMMDD").toDate()}
                  // className=" text-sm h-auto border-0"

                  //   onActiveStartDateChange={({ action, activeStartDate, value, view }) => {
                  //     setCalendarMonth(dayjs(activeStartDate));
                  //   }}
                  next2Label={null}
                  prev2Label={null}
                  view='month'
                  onClickDay={(v, e) => {}}
                  tileClassName={(props) =>
                    getTileClassName({
                      startDate: task.data.date,
                      endDate: task.data.endDate,
                      ...props,
                    })
                  }
                  // value={leaveArr}
                />
              </div>
            </div>
            <div className='flex flex-col basis-2/5 justify-center'>
              <Typography
                className='text-[#1976D2] underline text-center md:text-left whitespace-nowrap font-bold text-xl '
                component='p'
              >
                E-Gate-Pass
              </Typography>

              <Typography
                className='text-[#1D366D] whitespace-nowrap font-semibold  '
                component='p'
              >
                From :{" "}
                <Typography
                  className={`text-[#1D366D]  whitespace-nowrap  font-medium `}
                  component='span'
                >
                  {`${dayjs(task.data.date, "YYYYMMDD").format("DD/MM/YYYY")}`}

                  <Typography
                    className={`text-[#EB4242] ml-2   whitespace-nowrap  font-medium `}
                    component='span'
                  >
                    {`@${task.data.startTime}`}
                  </Typography>
                </Typography>
              </Typography>
              <Typography
                className='text-[#1D366D] whitespace-nowrap font-semibold  '
                component='p'
              >
                To :{" "}
                <Typography
                  className={` text-[#1D366D]  whitespace-nowrap  font-medium `}
                  component='span'
                >
                  {`${dayjs(task.data.endDate, "YYYYMMDD").format("DD/MM/YYYY")}`}
                  <Typography
                    className={`text-[#EB4242] ml-2   whitespace-nowrap  font-medium `}
                    component='span'
                  >
                    {`@${task.data.endTime}`}
                  </Typography>
                </Typography>
              </Typography>

              <Typography
                className='text-[#1D366D] whitespace-nowrap font-semibold  '
                component='p'
              >
                Destination :{" "}
                <Typography
                  className='text-[#1D366D]  whitespace-nowrap  font-medium '
                  component='span'
                >
                  {task.data.destination}
                </Typography>
              </Typography>

              <Typography
                className='text-[#1D366D] font-semibold  '
                component='p'
              >
                Reason :{" "}
                <Typography
                  className='text-[#464C59]  font-medium '
                  component='span'
                >
                  {task.data.reason}
                </Typography>
              </Typography>
              {/* <Typography
                className='text-[#1D366D] whitespace-nowrap font-semibold  '
                component='p'
              >
                Issue Date :{" "}
                <Typography
                  className='text-[#464C59]  font-medium '
                  component='span'
                >
                  {dayjs(task.data.created_at).format("DD/MM/YYYY HH:mm:ss")}
                </Typography>
              </Typography> */}
              <div className='flex flex-row gap-2 mt-2 justify-center md:justify-start'>
                {task.data.isReturn === "yes" && (
                  <div className='rounded-3xl py-1 px-2 w-fit bg-[#e2f7e1] border-[2px] border-[#86dc89] '>
                    <Typography
                      className='font-semibold text-[#2ba441]'
                      component='p'
                    >
                      Return to Factory
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;

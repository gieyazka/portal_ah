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
import _ from "lodash";
import axios from "axios";
import dayjs from "dayjs";
import { useLoading } from "@/store/store";

// import {use}
// dayjs.locale("th");
const LeaveDetail = (props: {
  task: task;
  storePreview: previewStore;
  leaveDaySwr: SWRResponse<any, any, any>;
}) => {
  const leaveDay = props.leaveDaySwr;
  const task: task = props.task;
  const storePreview: previewStore = props.storePreview;
  const loadingStore = useLoading();
  const [value, onChange] = React.useState(new Date());
  React.useEffect(() => {
    if (leaveDay.isLoading) {
      loadingStore.setLoading(true);
    } else {
      loadingStore.setLoading(false);
    }
  }, [leaveDay.isLoading]);
  const uniqMonth: string[] = _.uniq(
    task.data.leaveData.map((d: { date: Date }) => dayjs(d.date).format("MM"))
  );
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0; // Return true if it's a Sunday (0)
  };
  const getTileClassName = (props: { date: Date; leaveData: string[] }) => {
    if (
      props.leaveData.some((d) => d === dayjs(props.date).format("YYYYMMDD"))
    ) {
      return "bg-[#1D336D] text-white";
    }
    if (leaveDay.data) {
      if (
        leaveDay.data.some(
          (d: { sdate: string }) =>
            d.sdate === dayjs(props.date).format("YYYY-MM-DD")
        )
      ) {
        return "bg-red-500 text-white ";
      }
    }
    return isWeekend(props.date) ? "bg-red-500 text-white" : "";
  };

  return (
    <div className="text-sm md:text-lg md:px-4 pt-3 pb-2 w-full  ">
      <div className=" border-2 border-[#1D336D] rounded-lg px-2 py-2 md:px-2 relative">
        <p className="text-xl absolute -top-2 -translate-y-2 font-bold bg-white px-2">
          E Leave
        </p>
        <div className="w-[auto] m-2 flex flex-col items-center md:flex-row space-y-2 justify-center md:space-y-0 md:space-x-2">
          {uniqMonth.map((month) => {
            const leave_day = task.data.leaveData.filter(
              (d: any) => dayjs(d.date).format("MM") === month
            );
            const leaveArr = leave_day.map((d: { date: Date }) => {
              // console.log(d.date);
              return dayjs(d.date).format("YYYYMMDD");
            });
            return (
              <div
                className="border-2 border-black w-fit"
                key={month as React.Key}
              >
                <p className=" text-center  bg-[#FFFFFF] ">
                  {dayjs(month, "MM").format("MMMM")}
                </p>
                <Calendar
                  // className=" text-sm h-auto border-0"
                  showNavigation={false}
                  activeStartDate={dayjs(month, "MM").toDate()}
                  // onChange={onChange}
                  minDate={dayjs(month, "MM").startOf("month").toDate()}
                  maxDate={dayjs(month, "MM").endOf("month").toDate()}
                  // tileDisabled={({date}) => date.getDate()===date1}
                  // nextLabel={null}
                  // next2Label={null}
                  // prevLabel={null}
                  // prev2Label={null}
                  view="month"
                  onClickDay={(v, e) => {
                    // console.log(v, e);
                    return null;
                  }}
                  tileClassName={(props) =>
                    getTileClassName({ leaveData: leaveArr, ...props })
                  }
                  // value={leaveArr}
                />
              </div>
            );
          })}
        </div>
        <div className="flex mt-2 md:mx-4 flex-col">
          {/* <div className="flex md:flex-row flex-col  "> */}
          {/* <p className="basis-1/3">
              <b>From :</b> {dayjs(task.data.from).format("DD/MM/YYYY")}{" "}
            </p>
            <p className="basis-1/3">
              <b>To :</b> {dayjs(task.data.to).format("DD/MM/YYYY")}
            </p> */}

          {/* </div> */}
          <div className="flex md:flex-row flex-col mt-4 justify-between  ">
            <p className="">
              <b>Amount:</b> {task.data.amount} Days
            </p>
            <p className="">
              <b>Type :</b>{" "}
              {typeof task.data.type == "string"
                ? task.data.type
                : task.data.type.label}
            </p>
            <p className=" ">
              <b>Issue Date :</b>{" "}
              {dayjs(task.issueDate).format("DD/MM/YYYY HH:mm:ss")}
            </p>
          </div>
          <hr className="my-2" />
          <div className="flex flex-col ">
            <p>
              <b>Reason</b> :{" "}
            </p>
            <p>{task.data.reason}</p>
          </div>
          {task.data.filesURL !== undefined &&
            task.data.filesURL.length > 0 && (
              <div>
                <hr className="my-2" />
                <div className="flex flex-col ">
                  <p className="mb-2">
                    <b>File</b> :{" "}
                  </p>
                  <div className=" flex space-x-2">
                    {task.data.filesURL.map((file: string) => {
                      if (file.toLowerCase().includes(".pdf")) {
                        return (
                          <>
                            <div className="relative text-center h-24 w-24 cursor-pointer">
                              <div
                                onClick={async () => {
                                  const res = await axios.get(
                                    `${process.env.NEXT_PUBLIC_Strapi_Org}${file}`,
                                    {
                                      responseType: "blob",
                                    }
                                  );
                                  const pdfBlob = new Blob([res.data], {
                                    type: "application/pdf",
                                  });
                                  storePreview.onShowBackDrop(pdfBlob, "pdf");
                                }}
                                className="flex items-center border-2 rounded-md h-full w-full border-[#1D336D] "
                              >
                                <PictureAsPdf className="flex-1  text-[#1D336D]  " />
                              </div>
                            </div>
                          </>
                        );
                      } else if (
                        file.toLowerCase().includes(".xlsx") ||
                        file.toLowerCase().includes(".xls") ||
                        file.toLowerCase().includes(".csv")
                      ) {
                        return (
                          <>
                            <div className="relative text-center h-24 w-24 cursor-pointer">
                              <div
                                onClick={async () => {
                               
                                  var link = document.createElement('a');

                                  // Set download attribute and file URL
                                  link.setAttribute('href', `${process.env.NEXT_PUBLIC_Strapi_Org}${file}`);
                                  link.click();
                            
                                }}
                                className="flex items-center border-2 rounded-md h-full w-full border-[#1D336D] "
                              >
                                <DownloadIcon className="flex-1  text-[#1D336D] " />
                              </div>
                            </div>
                          </>
                        );
                      }
                      return (
                        <div key={file} className="flex h-24 w-24 relative cursor-pointer border-2 rounded-md  border-[#1D336D]">
                          <Image
                            placeholder="blur"
                            blurDataURL="/assets/image-placeholder.jpg"
                            onClick={() =>
                              storePreview.onShowBackDrop(
                                `${process.env.NEXT_PUBLIC_Strapi_Org}${file}`,
                                "image"
                              )
                            }
                            src={`${process.env.NEXT_PUBLIC_Strapi_Org}${file}`}
                            // className='w-full h-full'
                            fill
                            style={{
                              objectFit: "contain",
                              objectPosition: "center",
                            }}
                            // width={60}
                            // height={60}
                            alt={""}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
export default LeaveDetail;

import React from "react";
import { Typography } from "@mui/material";
import _ from "lodash";
import _apiFn from "@/utils/apiFn";
import commonFn from "@/utils/common";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { task } from "@/types/next-auth";
import { useTranslation } from "next-i18next";

dayjs.extend(isSameOrAfter);
type leaveType = {
  en: string;
  th: string;
  kh: string;
  borderColor: string;
  color: string;
  type: string;
};

const LeaveHistory = (props: { task: task; leaveQuota: {} }) => {
  const { t, i18n } = useTranslation("history");

  const [filterState, setFilterState] = React.useState<leaveType | undefined>(undefined);
  const handleFilterLeave = (leaveType: leaveType) => {
    if (leaveType.type === filterState?.type) {
      setFilterState(undefined);
    } else {
      setFilterState(leaveType);
    }
  };

  const showLeaveType: leaveType[] = [
    {
      en: "Annual Leave",
      th: "ลาพักร้อน",
      kh: "Annual Leave",
      borderColor: "#86DC89",
      color: "#E2F7E1",
      type: "annual",
    },
    {
      en: "Sick Leave",
      th: "ลาป่วย",
      kh: "Sick Leave",
      borderColor: "#FFE175",
      color: "#FEF5D6",
      type: "sick",
    },
    {
      en: "Personal Leave",
      th: "ลากิจ",
      kh: "Personal Leave",
      borderColor: "#FFA96B",
      color: "#FFE5D2",
      type: "personal",
    },
    {
      en: "Maternity Leave",
      th: "ลาคลอด",
      kh: "Maternity Leave",
      borderColor: "#CBC5F0",
      color: "#EBE8FF",
      type: "maternity",
    },
    {
      en: "Ordination Leave",
      th: "ลาบวช",
      kh: "Ordination Leave",
      borderColor: "#CBC5F0",
      color: "#EBE8FF",
      type: "ordination",
    },
    {
      en: "Military Service Leave",
      th: "ลาทหาร",
      kh: "Military Service Leave",
      borderColor: "#CBC5F0",
      color: "#EBE8FF",
      type: "military",
    },
  ];
  const { task, leaveQuota } = props;

  const empID = task.data.requester.empid;
  const leaveDay = _apiFn.useLeaveHistory({
    date: task.data.leaveData[0].date,
    empID,
    setting: leaveQuota?.quota?.settingLeave,
  });
  // console.log("92 leaveDay", leaveDay.data, task.data.leaveData[0].date);
  const addYear = parseInt(dayjs(task.data.leaveData[0].date, "YYYYMMDD").format("MM") ?? 0) > parseInt(leaveQuota?.quota?.settingLeave?.endYear ?? 0) ? 1 : 0;
  const syear = "s" + dayjs(task.data.leaveData[0].date, "YYYYMMDD").add(addYear, "year").format("YYYY");
  // console.log("syear 103", syear);
  const annualQuota =
    syear === "s2023"
      ? parseFloat(leaveQuota?.quota?.["s2024"]?.old?.quota ?? 0)
      : leaveQuota?.quota?.[syear]?.yearWork === 0 && dayjs().isSameOrAfter(dayjs(leaveQuota?.quota?.startDate, "YYYY-MM-DD").add(1, "year"))
      ? leaveQuota?.quota?.[syear]?.fullyYear
      : parseFloat(leaveQuota?.quota?.[syear]?.new?.remain ?? 0) + parseFloat(leaveQuota?.quota?.[syear]?.old?.remain ?? 0);

  return (
    <div className='flex flex-col  w-full h-full gap-4 mt-4 relative'>
      <div className=' w-full h-full relative'>
        <div
          className=' roundd-[10px] relative h-full  flex flex-col  bg-white'
          style={{
            boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Typography
            component='p'
            className='text-xl bg-[#D4E8FC] py-2 rounded-t-[10px] text-[#1976D2]  font-bold px-2'
          >
            Leave Request History (Year {dayjs(task.data.leaveData[0].date, "YYYYMMDD").add(addYear, "year").format("YYYY")})
          </Typography>

          <div className='flex gap-2 mt-3 mx-2'>
            {showLeaveType.map((leaveType) => {
              let sumLeave = _.sumBy(leaveDay.data?.leaveData, (o) => {
                if (o.type?.toUpperCase().includes(leaveType?.type.toUpperCase())) {
                  return o.amount;
                }
              });
              return (
                <div
                  onClick={() => handleFilterLeave(leaveType)}
                  style={{
                    borderColor: leaveType.borderColor,
                    background: leaveType.color,
                  }}
                  key={leaveType.type}
                  className={`text-[#464C59]  flex-1 border-2 rounded-xl p-4 flex flex-col items-center justify-center`}
                >
                  <Typography
                    className='font-semibold'
                    component='p'
                  >
                    {leaveType[i18n.language]}
                  </Typography>
                  <Typography
                    className='font-semibold'
                    component='p'
                  >
                    {sumLeave ?? 0}
                    {leaveType.type === "annual" && ` / ${annualQuota}`}
                  </Typography>
                </div>
              );
            })}
          </div>

          <div className='h-full flex flex-col flex-1 gap-2 my-2  px-0 '>
            <div className='flex '>
              <Typography
                component='p'
                className='p-2 text-center text-[#1D366D] font-semibold text-lg flex-1'
              >
                Leave Type
              </Typography>
              <Typography
                component='p'
                className='p-2 text-center text-[#1D366D] font-semibold text-lg flex-1'
              >
                Leave Date
              </Typography>
              <Typography
                component='p'
                className='p-2 text-center text-[#1D366D] font-semibold text-lg flex-1'
              >
                Total
              </Typography>
              <Typography
                component='p'
                className='p-2 text-center text-[#1D366D] font-semibold text-lg w-[30%]'
              >
                Reason
              </Typography>
              <Typography
                component='p'
                className='p-2 text-center text-[#1D366D] font-semibold text-lg flex-1'
              >
                Status
              </Typography>
              <Typography
                component='p'
                className='p-2 text-center text-[#1D366D] font-semibold text-lg w-[20px]'
              ></Typography>
            </div>
          </div>
          <div className='w-full max-h-[200px] overflow-y-auto flex flex-col gap-2  py-2  px-4 '>
            {_.orderBy(leaveDay.data?.rawLeave, ["createdAt", (item) => item.data.leaveData.dateStr], ["desc", "desc"])
              .filter((d) => {
                if (filterState === undefined) {
                  return true;
                } else {
                  return d.data?.type?.type?.toUpperCase().includes(filterState?.type.toUpperCase());
                }
              })
              .map((d, i) => {
                const leaveType = showLeaveType.find((o) => o.type.toUpperCase().includes(d.data.type.type.toUpperCase()));
                if (d.data.amount !== 0) {
                  const styleColor = commonFn.colorStatus(d.data.status);
                  // console.log("215", styleColor);
                  return (
                    <div
                      key={i + "_" + leaveType?.type}
                      className={`  flex-1  flex  bg-[#F5F5F5]  rounded-xl `}
                    >
                      <Typography
                        style={{
                          borderLeftColor: leaveType?.borderColor,
                          background: leaveType?.color,
                        }}
                        component='p'
                        className='p-2 text-center border-2 rounded-xl text-[#1D366D] font-semibold  flex-1'
                      >
                        {d.data?.type?.labelDisplay ? d.data?.type?.labelDisplay[i18n.language] : i18n.language === "th" ? d.data?.type.labelTH : d.data?.type.label}
                      </Typography>
                      <Typography
                        component='p'
                        className='p-2 text-center text-[#1D366D] font-semibold  flex-1'
                      >
                        {commonFn.renderLeaveData(d.data.leaveData)}
                        {/* {dayjs(d.date, "YYYYMMDD").format("DD/MM/YYYY")} */}
                      </Typography>
                      <Typography
                        component='p'
                        className='p-2 text-center text-[#1D366D] font-semibold  flex-1'
                      >
                        {d.data.amount}
                      </Typography>
                      <Typography
                        component='p'
                        className='p-2 text-center text-[#1D366D] font-semibold w-[30%]'
                      >
                        {d.data.reason}
                      </Typography>
                      <Typography
                        component='p'
                        style={{
                          backgroundColor: styleColor.backgroundColor,
                          color: styleColor.color,
                        }}
                        className='p-2 text-center  font-semibold text-lg flex-1'
                      >
                        {styleColor.message}
                      </Typography>
                    </div>
                  );
                }
              })}

            {_.orderBy(leaveDay.data?.leaveData, ["date"], ["desc"])
              .filter((d) => {
                if (filterState === undefined) {
                  return true;
                } else {
                  return d.type.toUpperCase().includes(filterState?.type.toUpperCase());
                }
              })
              .map((d, i) => {
                if (d.from === "ess") {
                  const leaveType = showLeaveType.find((o) => o.type?.toUpperCase().includes(d.type?.toUpperCase()));
                  return (
                    <div
                      key={i + "_" + leaveType?.type}
                      className={`  flex-1  flex  bg-[#F5F5F5]  rounded-xl `}
                    >
                      <Typography
                        style={{
                          borderLeftColor: leaveType?.borderColor,
                          background: leaveType?.color,
                        }}
                        component='p'
                        className='p-2 text-center border-2 rounded-xl text-[#1D366D] font-semibold  flex-1'
                      >
                        {leaveType && leaveType[i18n.language]}
                      </Typography>
                      <Typography
                        component='p'
                        className='p-2 text-center text-[#1D366D] font-semibold  flex-1'
                      >
                        {dayjs(d.date, "YYYYMMDD").format("DD/MM/YYYY")}
                      </Typography>
                      <Typography
                        component='p'
                        className='p-2 text-center text-[#1D366D] font-semibold  flex-1'
                      >
                        {d.amount}
                      </Typography>
                      <Typography
                        component='p'
                        className='p-2 text-center text-[#1D366D] font-semibold w-[30%]'
                      >
                        {d.from}
                      </Typography>
                      <Typography
                        component='p'
                        className='p-2 text-center text-[#1D366D] font-semibold flex-1'
                      ></Typography>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveHistory;

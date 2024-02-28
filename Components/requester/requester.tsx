import { Avatar, Skeleton, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { requester, task } from "@/types/next-auth";

import { User } from "iconsax-react";
import _ from "lodash";
import _apiFn from "@/utils/apiFn";
import dayjs from "dayjs";
import fn from "@/utils/common";
import { useQuery } from "react-query";

const Requester = (props: { task: task; requester: requester }) => {
  // const requester = props.task.data.requester;
  const task = props.task;
  const requester = props.requester;
  // const isLoading = props.isLoading || false;


  const queryEssProfile = useQuery(["userEss", task.data.requester.empid], () => _apiFn.getEssProfile(task.data.requester.empid), {
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const isLoading =  queryEssProfile.isLoading;
  const urlProfileEss = (_.last(queryEssProfile.data) as any)?.avatar?.url ?? undefined;
  return (
    <div className=' w-full h-full relative'>
      <div
        className=' rounded-[10px] relative h-full  flex flex-col  bg-white'
        style={{
          boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography
          component='p'
          className='text-xl bg-[#D4E8FC] py-2 rounded-t-[10px] text-[#1976D2]  font-bold px-2'
        >
          Requester Information
        </Typography>
        <div className='flex items-center flex-1 gap-4 my-2 py-8  px-8 '>
          <div className=' w-[12%]'>
            <Avatar
              src={urlProfileEss && `${process.env.NEXT_PUBLIC_ESS}${urlProfileEss}`}
              className='mx-auto h-[8vh] w-[8vh] bg-[#D8D9DA]'
            >
              {/* `${process.env.NEXT_PUBLIC_ESS}/users?username=${empId}` */}
              <User
                size='32'
                color='#464C59'
              />
            </Avatar>
          </div>
          <div className='flex gap-2 w-full'>
            <div className='basis-[45%] '>
              <RenderTxt
                label={`Name :`}
                data={requester?.name}
                isLoading={isLoading}
              />
              <RenderTxt
                label={`Employee ID :`}
                data={requester?.empid}
                isLoading={isLoading}
              />
              <RenderTxt
                label={`Start Date :`}
                data={requester?.startDate}
                isLoading={isLoading}
              />
              <RenderTxt
                label={``}
                data={`(${fn.getDiffDate(requester?.startDate)})`}
                isLoading={isLoading}
              />

              {/* <Typography
                component='p'
                className='whitespace-pre-line'
              >
                ({fn.getDiffDate(requester?.startDate)})
              </Typography> */}
            </div>
            <div className='flex-1   relative   '>
              <RenderTxt
                label={`Company :`}
                data={requester?.companyPayroll || requester?.company}
                isLoading={isLoading}
              />
              <RenderTxt
                label={`Department :`}
                data={requester?.departmentPayroll ?? requester?.department}
                isLoading={isLoading}
              />
              <RenderTxt
                label={`Position :`}
                data={requester?.position ?? "-"}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requester;

type RenderTxtProps = {
  [key: string]: any;
} & {
  isLoading: boolean;
};

const RenderTxt: FC<RenderTxtProps> = (props) => {
  const { label, data, isLoading } = props;

  return (
    <>
      {isLoading ? (
        <Skeleton
          variant='text'
          sx={{ fontSize: "16px" }}
        />
      ) : (
        <Typography component='p'>
          <b
            style={{
              color: "#1D366D",
              fontFamily: " Bai Jamjuree",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "170%",
            }}
          >
            {label}
          </b>{" "}
          {data}
        </Typography>
      )}
    </>
  );
};

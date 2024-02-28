import React, { FC } from "react";
import { Skeleton, Typography } from "@mui/material";

import RenderTxt from "@/Components/skeleton";
import { RenderTxtProps } from "@/types/common";
import _apiFn from "@/utils/apiFn";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { useViewStore } from "@/store/store";

const ApproverData = (props: { approver: { [x: string]: any } }) => {
  const viewStore = useViewStore();
  const { approver } = props;
  // const queryData = useQuery(["employee", approver.email], () => _apiFn.getUserProfile(approver.email), {
  //   enabled: approver?.email !== undefined,
  //   refetchInterval: false,
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  // });



  const queryData = useQuery(
    ["employee", approver.email, approver?.empId],
    async () => {
      if (approver.empId) {
        const userPayRoll = await _apiFn.getUserInfo(approver?.empId);
        const data = { userPayRoll: userPayRoll.employee };
        return data;
      } else {
        return _apiFn.getUserProfile(approver.email as string);
      }
    },
    {
      enabled: approver?.name === undefined,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const userPayRoll = queryData.data?.userPayRoll;
  const isLoading = queryData.isLoading;
  if (approver.email)
    return (
      <div className=' text-[#818181] font-semibold text-sm  '>
        <RenderTxt
          txt={userPayRoll?.name_en}
          isLoading={isLoading}
        />
        <RenderTxt
          txt={userPayRoll?.position_th}
          isLoading={isLoading}
        />

        {viewStore.isMd && (
          <>
            <RenderTxt
              txt={userPayRoll && ` Department : ${userPayRoll?.company} : ${userPayRoll?.department}`}
              isLoading={isLoading}
            />
            <RenderTxt
              txt={approver.actionDate && dayjs(approver.actionDate).format("DD/MM/YYYY @HH:mm")}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    );
  else
    return (
      <div className=' text-[#818181] font-semibold text-sm  '>
        <RenderTxt txt={approver.type?.toUpperCase()} />
      </div>
    );
};

export default ApproverData;


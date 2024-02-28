import dayjs, { Dayjs } from "dayjs";
import { filterStore, task, userData } from "@/types/next-auth";
import useSWR, { useSWRConfig } from "swr";

import { Session } from "next-auth";
import _ from "lodash";
import axios from "axios";
import { useQuery } from "react-query";

const getAllCompany = async () => {
  const res = await axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_Strapi_Org}/companies?populate[0]=departments&populate[1]=departments.sections&populate[2]=departments.sections.sub_sections`,
  });
  return res.data?.data;
};

const getLeaveCalendar = async (props: {
  company: string;
  department: string;
  section: string;
  sub_section: string;
  startDate: string;
  endDate: string;
}) => {
  const res = await axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/custom_api/getLeaveCalendar/`,
    data: props,
  });
  return res.data;
};

export { getAllCompany, getLeaveCalendar };

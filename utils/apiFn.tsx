import dayjs,{ Dayjs } from "dayjs";
import useSWR, { useSWRConfig } from "swr";

import axios from "axios";
import useSWRImmutable from "swr/immutable";
import { userData } from "@/types/next-auth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const fetcherPost = (url: string, data: {}) =>
  axios.post(url, { data: data }).then((res) => res.data);

const signInStrapi = async (identifier: string, password: string) => {
  const res = await axios.post(
    `${process.env.NEXT_ESS}/auth/local`,
    {
      identifier,
      password,
    },
    {
      validateStatus: function (status) {
        return status < 500;
      },
    }
  );
  return res;
};

const useUser = () => {
  const user = useSWRImmutable("/api/auth/session", fetcher, {
    refreshInterval: 600000,
  });
  return user;
};

const useMyTask = (data: {
  empid: string;
  status: string;
  startDate: Dayjs;
  endDate: Dayjs;
  isFetch: boolean;
}) => {
  const myTask = useSWR(
    data.empid !== undefined && data.isFetch === true
      ? [
          `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/custom_api/find_my_task`,
          data,
        ]
      : null,
    ([url, data]) => fetcherPost(url, data),
    {
      refreshInterval: 300000,
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return myTask;
};

const usePosition = () => {
  const myTask = useSWR(
    `${process.env.NEXT_PUBLIC_Strapi}/api/levels`,

    (url) => fetcher(url),
    {
      refreshInterval: 300000,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return myTask;
};

const useCurrentTask = (user: userData) => {
  const myTask = useSWR(
    user !== undefined
      ? [
          `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/custom_api/find_user_approve`,
          user,
        ]
      : null,
    ([url, data]) => fetcherPost(url, data),
    {
      refreshInterval: 600000,
      // revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return myTask;
};

const getMyLevels = async (empid: string) => {
  const myLevel = await axios.post(
    `${process.env.NEXT_PUBLIC_Strapi}/api/hierachies/checkMyLevel`,
    {
      empid: empid,
    }
  );

  return myLevel;
};

const actionJob = async (task: { items: { id: string }[] }, status: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/api/engine/invoke/${
      task.items.findLast((e) => e).id
    }/approved/${status}`
  );
  return res;
};

export {
  signInStrapi,
  useUser,
  useMyTask,
  getMyLevels,
  useCurrentTask,
  actionJob,
  usePosition,
};

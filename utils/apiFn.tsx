import dayjs, { Dayjs } from "dayjs";
import { task, userData } from "@/types/next-auth";
import useSWR, { useSWRConfig } from "swr";

import { Session } from "next-auth";
import axios from "axios";
import useSWRImmutable from "swr/immutable";

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
const getMyHierachies = async (empid: string) => {
  // /api/hierachies
  const myLevel = await axios.get(
    `${process.env.NEXT_PUBLIC_Strapi}/api/hierachies?populate=*&filters[employee][empid][$eq]=${empid}`
  );
  return myLevel;
};

const actionJob = async (
  task: task | undefined,
  field: string,
  fieldData: any,
  user: Session,
  formData: any
) => {
  let data: any = {
    task_id: task?.items.findLast((e: {}) => e).id,
    field: field,
    fieldData: fieldData,
    user: user.user,
    // formData,
  };
  let send_formData = new FormData();

  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      const element = formData[key];
      console.log(key, element);
      if (key === "file") {
        if (element.length > 0) {
          element.forEach((fileData: any) => {
            send_formData.append(`files`, fileData.file, fileData.name);
          });
        }
        data["haveFile"] = true;
      } else {
        data[key] = element;
      }
    }
  }
  send_formData.append("data", JSON.stringify(data));
  // console.log(data);
  // console.log(formData);

  const res = await axios({
    method: "post",
    url: `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/api/engine/invoke/`,
    data: send_formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};
const _apiFn = {
  signInStrapi,
  useUser,
  useMyTask,
  getMyLevels,
  useCurrentTask,
  actionJob,
  usePosition,
  getMyHierachies,
};
export default _apiFn;

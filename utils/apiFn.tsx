import dayjs, { Dayjs } from "dayjs";
import { filterStore, task, userData } from "@/types/next-auth";
import useSWR, { useSWRConfig } from "swr";

import { Session } from "next-auth";
import _ from "lodash";
import axios from "axios";
import { useQuery } from "react-query";
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
const signOrgChart = async (identifier: string, password: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_Strapi}/api/users`,
    {
      username: identifier,
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
const getUserData = async (email: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_Strapi}/api/users/getUserByEmail`,
    {
      email,
    },
    {
      validateStatus: function (status) {
        return status < 500;
      },
    }
  );
  return res;
};
const getLDAPData = async (ldap_username: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_Strapi}/api/users/getLdapByUsername`,
    {
      ldap_username: ldap_username,
    },
    {
      validateStatus: function (status) {
        return status < 500;
      },
    }
  );
  return res;
};
//DONE
const useUser = () => {
  const user = useSWRImmutable("/api/auth/session", fetcher, {
    refreshInterval: 600000,
  });
  return user;
};
const useHrSetting = (isFetch: boolean) => {
  const hrSetting = useSWRImmutable(
    isFetch ? `/api/workflow/custom_api/getHRLeaveSetting` : null,
    fetcher,
    {
      refreshInterval: 600000,
    }
  );
  return hrSetting;
};
//DONE
const useMyTask = (data: {
  email?: string;
  empid?: string;
  status: string;
  startDate: Dayjs;
  endDate: Dayjs;
  isFetch: boolean;
}) => {
  const myTask = useSWR(
    data.email !== undefined
      ? [`/api/workflow/custom_api/find_my_task`, data]
      : null,
    ([url, data]) => fetcherPost(url, data),
    {
      refreshInterval: 300000,
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  // const dataQuery = {
  //   ...myTask,
  //   data: _.orderBy(myTask.data, ["issueDate"], ["desc"]),
  // };
  // return dataQuery;
  return myTask;
};

const usePosition = () => {
  const myTask = useSWR(
    `/api/orgchart/levels`,

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
//DONE
const useAction_logs = (data: { user: userData; filterStore: filterStore }) => {
  if (data.user) {
    delete data.user.jwt;
  }
  const { startDate, endDate } = data.filterStore;
  const newData = { user: data.user, filterStore: { startDate, endDate } };
  const myTask = useSWR(
    data.user !== undefined
      ? [`/api/workflow/custom_api/find_action_logs`, newData]
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
//DONE
const useCurrentTask = (data: { user: userData; filterStore: filterStore }) => {
  const { startDate, endDate } = data.filterStore;
  const newData = { user: data.user, filterStore: { startDate, endDate } };
  const myTask = useSWR(
    data.user !== undefined
      ? [`/api/workflow/custom_api/find_user_approve`, newData]
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
const useCarbookingTask = (data: { user: userData }) => {
  const carBookingTask = useSWR(
    data.user === undefined
      ? null
      : `https://ess.aapico.com/bookings?status=free&managerApprove_null=true&managerEmail=${data.user.email}`,
    fetcher,
    {
      refreshInterval: 600000,
      // revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (carBookingTask.data !== undefined) {
    carBookingTask.data.forEach((data: any) => {
      data["issueDate"] = dayjs(data.created_at).toISOString();
      data["task_id"] = data.id;
      data.data = {
        flowName: "Car Booking",
        reason: data.reason,

        requester: {
          empid: data.user,
          name: data.name,
          company: data.company,
          department: data.department,
        },
        status: data.status === "free" ? "Waiting" : data.status,
      };
    });
  }
  return carBookingTask;
};
//DONE
const useTaskByItemID = (itemID: string | undefined) => {
  const myTask = useSWR(
    itemID !== undefined
      ? [`/api/workflow/custom_api/getTaskByItemID`, itemID]
      : null,
    ([url, data]) => fetcherPost(url, data),
    {
      refreshInterval: 600000,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return myTask;
};
//NOT USE
const getMyLevels = async (empid: string) => {
  const myLevel = await axios.post(
    `${process.env.NEXT_PUBLIC_Strapi}/api/hierachies/checkMyLevel`,
    {
      empid: empid,
    }
  );

  return myLevel;
};
//NOT USE
const getMyHierachies = async (empid: string) => {
  // /api/hierachies
  const myLevel = await axios.get(
    `${process.env.NEXT_PUBLIC_Strapi}/api/hierachies?populate=*&filters[employee][empid][$eq]=${empid}`
  );
  return myLevel;
};
//DONE
const actionJob = async (
  task: task | undefined,
  field: string,
  fieldData: any,
  user: Session | undefined,
  formData: any
) => {
  const lastItem: any = _.last(task?.items);
  let data: any = {
    task_id: lastItem.id,
    field: field,
    fieldData: fieldData,
    user: user?.user ?? null,
    // formData,
  };

  let send_formData = new FormData();
  data["haveFile"] = false;
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      const element = formData[key];
      if (key === "file") {
        if (element.length > 0) {
          element.forEach((fileData: any) => {
            send_formData.append(`files`, fileData.file, fileData.name);
          });
          data["haveFile"] = true;
        }
      } else {
        data[key] = element;
      }
    }
  }
  send_formData.append("data", JSON.stringify(data));
  // console.log(formData);
  const res = await axios({
    method: "post",
    url: `/api/workflow/approve/`,
    data: send_formData,
    headers: { "Content-Type": "multipart/form-data" },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });

  // const res = await axios({
  //   method: "post",
  //   url: `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/api/engine/invoke/`,
  //   data: send_formData,
  //   headers: { "Content-Type": "multipart/form-data" },
  //   validateStatus: function (status) {
  //     return status < 500; // Resolve only if the status code is less than 500
  //   },
  // });
  return res;
};

const useLeaveDay = (site: string | undefined, type: string | undefined) => {
  const leaveday = useSWRImmutable(
    site === undefined
      ? null
      : `https://ess.aapico.com/calendars?site=${site}&subsite=${type}&_limit=-1`,
    fetcher
    // { refreshInterval: 10000 }
  );
  return leaveday;
  // return { data: selectMachine, error, isLoading };
};

const getFileInfo = async (fileURL: string) => {
  const res = await axios.get(
    `/api/orgchart/upload/getFileDetail?filters[url]=${fileURL}`
  );
  if (res.data[0] === undefined) {
    return { name: "File Error", isError: true };
  }
  return res.data[0];
};

const _apiFn = {
  signInStrapi,
  getFileInfo,
  signOrgChart,
  getUserData,
  getLDAPData,
  useUser,
  useHrSetting,
  useMyTask,
  getMyLevels,
  useCurrentTask,
  useCarbookingTask,
  useTaskByItemID,
  actionJob,
  usePosition,
  getMyHierachies,
  useAction_logs,
  useLeaveDay,
  // emailApprove,
};
export default _apiFn;

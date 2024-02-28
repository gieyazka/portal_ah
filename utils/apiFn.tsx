import dayjs, { Dayjs } from "dayjs";
import { filterStore, task, userData } from "@/types/next-auth";
import useSWR, { useSWRConfig } from "swr";

import { Session } from "next-auth";
import _ from "lodash";
import axios from "axios";
import { useQuery } from "react-query";
import useSWRImmutable from "swr/immutable";

const fetcherHost = (url: string) => fetch(`${url}`).then((res) => res.json());
const fetcherHostPost = (url: string, data: {}) => axios.post(`${url}`, { data: data }, { headers: { "x-api-key": "12345" } }).then((res) => res.data);
const fetcher = (url: string) => fetch(`${process.env.NEXT_PUBLIC_WORKFLOW_URL}${url}`).then((res) => res.json());
const fetcherPost = (url: string, data: {}) => axios.post(`${process.env.NEXT_PUBLIC_WORKFLOW_URL}${url}`, { data: data }, { headers: { "x-api-key": "12345" } }).then((res) => res.data);
const fetcherOrg = (url: string) => fetch(`${process.env.NEXT_PUBLIC_Strapi_Org}${url}`).then((res) => res.json());
const fetcherPostOrg = (url: string, data: {}) => axios.post(`${process.env.NEXT_PUBLIC_Strapi_Org}${url}`, { data: data }).then((res) => res.data);

const signInStrapi = async (identifier: string, password: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_ESS}/auth/local`,
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
    `${process.env.NEXT_PUBLIC_Strapi_Org}/users`,
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
    `${process.env.NEXT_PUBLIC_Strapi_Org}/users/getUserByEmail`,
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

const getUserDataByPrincipalName = async (principalName: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_Strapi_Org}/users/getUserByPrincipalName`,
    {
      principalName,
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
    `${process.env.NEXT_PUBLIC_Strapi_Org}/users/getLdapByUsername`,
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
const getLDAPDataByEmpID = async (empid: string) => {
  console.log('9222222',  `${process.env.NEXT_PUBLIC_Strapi_Org}/users/getLdapByempID`)
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_Strapi_Org}/users/getLdapByempID`,
    {
      empid,
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
  const user = useSWRImmutable("/api/auth/session", fetcherHost, {
    refreshInterval: 600000,
  });
  return user;
};
const useHrSetting = (isFetch: boolean) => {
  const hrSetting = useSWRImmutable(isFetch ? `/custom_api/getHRLeaveSetting` : null, fetcher, {
    refreshInterval: 600000,
  });
  return hrSetting;
};
//DONE
const useMyTask = (data: { email?: string; empid?: string; status: string; startDate: Dayjs; endDate: Dayjs; isFetch: boolean }) => {
  const myTask = useSWR(data.email !== undefined ? [`/custom_api/find_my_task`, data] : null, ([url, data]) => fetcherPost(url, data), {
    // const myTask = useSWR(data.email !== undefined ? [`/custom_api/find_my_task`, data] : null, ([url, data]) => fetcherPost(url, data), {
    refreshInterval: 300000,
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return myTask;
};

const usePosition = () => {
  const myTask = useSWR(
    `levels`,

    (url) => fetcherOrg(url),
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
  const myTask = useSWR(data.user !== undefined ? [`/api/task/history`, newData] : null, ([url, data]) => fetcherHostPost(url, data), {
    // const myTask = useSWR(data.user !== undefined ? [`/custom_api/find_action_logs`, newData] : null, ([url, data]) => fetcherPost(url, data), {
    refreshInterval: 600000,
    // revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return myTask;
};
//DONE
const useCurrentTask = (data: { user: userData; filterStore: filterStore }) => {
  const { startDate, endDate } = data.filterStore;
  const newData = { user: data.user, filterStore: { startDate, endDate } };
  const myTask = useSWR(data.user !== undefined ? [`/api/task/pending`, newData] : null, ([url, data]) => fetcherHostPost(url, data), {
    // const myTask = useSWR(data.user !== undefined ? [`/custom_api/find_user_approve`, newData] : null, ([url, data]) => fetcherPost(url, data), {
    refreshInterval: 600000,
    // revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return myTask;
};
const useCarbookingTask = (data: { user: userData }) => {
  const carBookingTask = useSWR(data.user === undefined ? null : `https://ess.aapico.com/bookings?status=free&managerApprove_null=true&managerEmail=${data.user.email}`, fetcherHost, {
    refreshInterval: 600000,
    // revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
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
  const myTask = useSWR(itemID !== undefined ? [`/custom_api/getTaskByItemID`, itemID] : null, ([url, data]) => fetcherPost(url, data), {
    refreshInterval: 600000,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return myTask;
};
//NOT USE
const getMyLevels = async (empid: string) => {
  const myLevel = await axios.post(`${process.env.NEXT_PUBLIC_Strapi_Org}/hierachies/checkMyLevel`, {
    empid: empid,
  });

  return myLevel;
};

const getMyHierachies = async (empid: string) => {
  const myLevel = await axios.get(`${process.env.NEXT_PUBLIC_Strapi_Org}/hierachies?populate=*&filters[employee][empid][$eq]=${empid}`);
  return myLevel?.data?.data ?? [];
};
//DONE
const actionJob = async (task: task | undefined, field: string, fieldData: any, user: Session | undefined, formData: any, email: string | undefined) => {
  const lastItem: any = _.last(task?.items);
  let data: any = {
    task_id: lastItem.id,
    field: field,
    fieldData: fieldData,
    user: user?.user ?? null,
    email: email,
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
    // url: `/approve/`,
    url: `${process.env.NEXT_PUBLIC_WORKFLOW_URL}/api/engine/invoke/`,
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

const useLeaveDay = (
  leaveQuota: {
    quota: {};
  },
  site: string | undefined,
  type: string | undefined
) => {
  const leaveday = useSWRImmutable(
    site === undefined && leaveQuota === undefined ? null : `https://ess.aapico.com/calendars?site=${site}&subsite=${type}&_limit=-1`,
    fetcherHost
    // { refreshInterval: 10000 }
  );
  return leaveday;
  // return { data: selectMachine, error, isLoading };
};
const useTaskByTaskID = (task_id: string) => {
  const currentTask = useSWRImmutable(
    task_id === undefined ? null : [`/custom_api/getTaskByTaskId`, { task_id }],
    ([url, data]) => fetcherPost(url, data)
    // { refreshInterval: 10000 }
  );
  return currentTask;
  // return { data: selectMachine, error, isLoading };
};
const useLeaveHistory = (data: { date: string; empID: string; setting: { endYear: string; startYear: string } }) => {
  const { empID, date, setting } = data;
  const { endYear = undefined, startYear = undefined } = setting ?? {};
  const myTask = useSWR(
    empID !== undefined && date !== undefined && setting != undefined ? [`/custom_api/getLeaveDay`, { date, empID, endYear, startYear }] : null,
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
const useLeaveQuota = (data: { empID: string; date: Date }) => {
  const { empID, date } = data;
  const myTask = useSWR(data.empID !== undefined ? [`/custom_api/getLeaveQuota`, { empID, date }] : null, ([url, data]) => fetcherPost(url, data), {
    refreshInterval: 300000,
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return myTask;
};

const getFileInfo = async (fileURL: string) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_Strapi_Org}/upload/files?filters[url]=${fileURL}`);
  // const res = await axios.get(`${process.env.NEXT_PUBLIC_Strapi_Org}/upload/getFileDetail?filters[url]=${fileURL}`);
  if (res.data[0] === undefined) {
    return { name: "File Error", isError: true };
  }
  return res.data[0];
};

const getUserInfo = async (empId: string) => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_Strapi_Org}/users/userInfo/${empId}`,
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  };
  const res = await axios(config);

  return res.data;
};
const getEssProfile = async (empId: string) => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_ESS}/users?username=${empId}`,
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  };
  const res = await axios(config);

  return res.data;
};

const getUserProfile = async (email: string) => {
  const userData = await getUserData(email);
  if (userData.data.employee) {
    const empId = userData.data.employee.empid;
    const userPayRoll = await getUserInfo(empId);
    const cloneData = _.cloneDeep(userData.data);
    cloneData.userPayRoll = userPayRoll.employee;
    return cloneData;
  }

  return userData;
};

const _apiFn = {
  getUserProfile,
  getEssProfile,
  getUserInfo,
  useLeaveQuota,
  signInStrapi,
  useLeaveHistory,
  getFileInfo,
  signOrgChart,
  getUserData,
  getUserDataByPrincipalName,
  getLDAPData,
  getLDAPDataByEmpID,
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
  useTaskByTaskID,
  // emailApprove,
};
export default _apiFn;

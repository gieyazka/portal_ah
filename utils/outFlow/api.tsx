import _ from "lodash";
import axios from "axios";
import dayjs from "dayjs";
import { task } from "@/types/next-auth";

const carBookingAPi = `${process.env.NEXT_PUBLIC_ESS}/bookings`;
const gatePassAPi = `${process.env.NEXT_PUBLIC_ESS}/requestinstances`;

const actionOutFlow = async (task: task, user: any, isApprove: boolean, hookForm: any) => {
  // console.log("task.data", task.data);
  // console.log("user", user.user);
  // console.log("isApprove", isApprove);
  // console.log("hookForm", hookForm);
  switch (task.data.flowName) {
    case "Car Booking":
      return axios.put(`${carBookingAPi}/${task.data.id}`, {
        managerApprove: isApprove,
        managerApproveTime: dayjs().format("YYYYMMDD HH:mm"),
        managerApprove_by: user?.user?.email,
      });
    case "E-Gate-Pass":
      const cloneTask = _.cloneDeep(task);
      const newDetail = { ...cloneTask.details, approverEmpId: user?.user?.empid };
      return axios.put(`${gatePassAPi}/${task.data.id}`, {
        status: isApprove ? "mgr_approved" : "mgr_rejected",
        action_by: `manager-${user?.user?.userWithoutCompany}`,
        mgr_comment: hookForm.remark,
        isUnRead: true,
        details: newDetail,
      });
    default:
  }
};

const getCarBookingData = async (queryStr: string) => {
  const carBookingTask = `${carBookingAPi}${queryStr}&_limit=30`;
  const getCarbookingTask = await axios({
    method: "GET",
    url: carBookingTask,
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  return getCarbookingTask;
};
const getGatePassData = async (queryStr: string) => {
  const query = `${gatePassAPi}${queryStr}&_limit=30`;
  const getTask = await axios({
    method: "GET",
    url: query,
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  return getTask;
};
const getOTData = async (queryStr: string) => {
  const query = `${gatePassAPi}${queryStr}&_limit=30`;
  const getTask = await axios({
    method: "GET",
    url: query,
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
  return getTask;
};

const outFlowExport = { actionOutFlow, getCarBookingData, getGatePassData };
export default outFlowExport;

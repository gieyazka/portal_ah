import { customAlphabet } from "nanoid";
import dayjs from "dayjs";
import { task } from "@/types/next-auth";

const formatData = (task: []) => {
  const dataArr: task[] = [];
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 2);
  task.forEach((data: any) => {
    data["issueDate"] = dayjs(data.created_at).toISOString();
    data["task_id"] = `EF-${dayjs(data.created_at).format("YYMMDD")}${data.id}-CB`;

    data.data = {
      id: data.id,
      flowName: "Car Booking",
      reason: data.reason,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      carType: data.carType,
      totalPassenger: data.totalPassenger,
      urgent: data.urgent,
      needDriver: data.needDriver,
      destination: data.destination,
      destProvince: data.destProvince,
      created_at: data.created_at,
      uuid: data.uuid,
      currentApprover: data.managerApprove === null && {
        email: data.managerEmail,
      },
      isOutFlow: true,
      notNeedFile: true,
      notNeedRemark: true,
      approverStep: [
        {
          email: data.managerEmail,
          actionDate: data.managerApproveTime && dayjs(data.managerApproveTime, "YYYYMMDD HH:mm").toDate(),
          type: undefined,
          status: data.managerApprove === null ? "Waiting" : data.managerApprove ? "Approved" : "Rejected",
          // status: data.status === "cancle" && data.hrApprove === true ? "Reject" : data.manageractionDate ? "Approve" : "Waiting"
        },
        {
          email: undefined,
          type: "Hr",
          actionDate: data.hrApproveTime && dayjs(data.hrApproveTime, "YYYYMMDD HH:mm").toDate(),
          status: data.hrApprove === null ? "Waiting" : data.hrApprove ? "Approved" : "Rejected",
        },
      ],
      actionLog: [
        {
          action: "Submit",
          name: data.name,
          company: data.company,
          date: data.created_at,
          remark: "Submit form",
          filesURL: null,
        },
      ],

      requester: {
        empid: data.user,
        name: data.name,
        company: data.company,
        department: data.department,
      },
      status: data.managerApprove === false ? "Rejected" : data.status === "free" ? "Waiting" : data.status === "cancle" ? "Cancel" : data.status,
    };

    if (data.data.approverStep[0].status !== "Waiting") {
      data.data.actionLog.push(addActionLog(data.data.approverStep[0]));
    }
    if (data.data.approverStep[1].status !== "Waiting") {
      data.data.actionLog.push(addActionLog(data.data.approverStep[1]));
    }

    if (data.cancleBy) {
      data.data.approverStep.push({
        email: undefined,
        type: data.cancleBy,
        actionDate: data.hrApproveTime && dayjs(data.updated_at).toDate(),
        status: "Cancel",
      });
      data.data.actionLog.push(addActionLog(data.data.approverStep[2]));
    }

    dataArr.push(data);
  });
  return dataArr;
};

const addActionLog = (approver: { status: any; email: any; actionDate: any; type: any; file: any }) => {
  return {
    action: approver.status,
    name: undefined,
    company: undefined,
    email: approver.email,
    date: approver.actionDate,
    remark: "-",
    filesURL: approver.file || null,
    type: approver.type,
  };
};






const carBookingCommon = {
  addActionLog,
  formatData,
};

export default carBookingCommon;

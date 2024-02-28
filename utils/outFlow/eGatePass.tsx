import { customAlphabet } from "nanoid";
import dayjs from "dayjs";
import { task } from "@/types/next-auth";

const formatData = (task: []) => {
  const dataArr: task[] = [];
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 2);
  task.forEach((data: any) => {
    const detail = data.details;
    data["issueDate"] = dayjs(data.created_at).toISOString();
    data["task_id"] = `EF-${dayjs(data.created_at).format("YYMMDD")}${data.id}-EG`;
    const requesterName = data.firstName + " " + data.lastName;
    data.data = {
      id: data.id,
      flowName: data.doc_type,
      reason: detail.purpose,
      date: dayjs(detail.from).format("YYYYMMDD"),
      startTime: dayjs(detail.from).format("HH:mm"),
      endDate: dayjs(detail.to).format("YYYYMMDD"),
      endTime: dayjs(detail.to).format("HH:mm"),
      destination: detail.destination,
      isReturn: data.return,
      currentApprover: data.status === "waiting" && {
        email: data.manager,
      },
      isOutFlow: true,
      notNeedFile: true,
      notNeedRemark: false,
      approverStep: [
        {
          email: data.manager,
          empId: detail.approverEmpId,
          actionDate: data.managerApproveTime && dayjs(data.managerApproveTime, "YYYYMMDD HH:mm").toDate(),
          type: undefined,
          status: data.status === "waiting" ? "Waiting" : data.status === "mgr_rejected" ? "Rejected" : data.status === "delete" ? "Cancel" : "Approved",
          remark: data.mgr_comment,
          // status: data.status === "cancle" && data.hrApprove === true ? "Reject" : data.manageractionDate ? "Approve" : "Waiting"
        },
      ],
      actionLog: [
        {
          action: "Submit",
          empId: data.company + data.emp_id,
          //   name: requesterName,
          company: data.company,
          date: data.created_at,
          remark: "Submit form",
          filesURL: null,
        },
      ],

      requester: {
        empid: data.company + data.emp_id,
        name: requesterName,
        company: data.company,
        department: data.department,
      },
      status: data.status === "waiting" ? "Waiting" : data.status === "mgr_rejected" ? "Rejected" : data.status === "delete" ? "Cancel" : "Approved",
    };

    if (data.status !== "waiting") {
      data.data.actionLog.push(addActionLog(data.data.approverStep[0]));
    }

    dataArr.push(data);
  });
  return dataArr;
};
const addActionLog = (approver: { status: any; email: any; actionDate: any; type: any; file: any; remark: string | undefined }) => {
  return {
    action: approver.status,
    empId: approver.empId,
    name: undefined,
    company: undefined,
    email: approver.email,
    date: approver.actionDate,
    remark: approver.remark,
    filesURL: approver.file || null,
    type: approver.type,
  };
};

const common = { formatData };
export default common;

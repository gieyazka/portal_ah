import { menuItem, subMenu } from "@/types/next-auth";

import { Assignment } from "@mui/icons-material";
import Job_Pending from "./my_action/job_pending";

const data: menuItem[] = [
  {
    name: "My Tasks",
    url: "my_task",
    icon: (props: {}) => {
      return <Assignment />;
    },
    subMenu: [
      {
        name: "In process",
        url: "in_process",
      },
      {
        name: "Reject",
        url: "reject",
      },
      {
        name: "Completed",
        url: "completed",
      },
    ],
  },
  {
    name: "My action",
    url: "my_action",
    subMenu: [
      {
        name: "Job Pending",
        url: "job_pending",
      },
      {
        name: "Action logs",
        url: "action_logs",
      },
    ],
  },
  {
    name: "Form Requisition",
    url: "/",
    subMenu: [
      {
        name: "In process",
        url: "in_process",
      },
      {
        name: "Reject",
        url: "reject",
      },
      {
        name: "Completed",
        url: "completed",
      },
    ],
  },
];

export default data;

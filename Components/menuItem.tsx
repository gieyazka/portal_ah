import {
  AccessTime,
  Assignment,
  CheckCircleOutline,
  HighlightOff,
  History,
} from "@mui/icons-material";
import {
  ClipboardText,
  CloseCircle,
  HambergerMenu,
  TaskSquare,
  TickCircle,
  Timer,
} from "iconsax-react";
import { menuItem, subMenu } from "@/types/next-auth";

import Job_Pending from "./myAction/job_pending";

const data: menuItem[] = [
  {
    name: "My Action",
    url: "my_action",
    subMenu: [
      {
        name: "Job Pending",
        url: "job_pending",
        icon: (props: { isSelect: boolean }) => {
          return (
            <ClipboardText
              size="18"
              color={props.isSelect ? "#FFFFFF" : "#B4B6CD"}
            />
          );
        },
      },
      {
        name: "Action History",
        url: "action_logs",
        icon: (props: { isSelect: boolean }) => {
          return (
            <TaskSquare
              size="18"
              color={props.isSelect ? "#FFFFFF" : "#B4B6CD"}
            />
          );
        },
      },
    ],
  },
  {
    name: "My Request",
    url: "my_task",
    icon: (props: { isSelect: boolean }) => {
      return <Timer size="18" color={props.isSelect ? "#FFFFFF" : "#B4B6CD"} />;
    },
    subMenu: [
      {
        name: "In Process",
        url: "in_process",
        icon: (props: { isSelect: boolean }) => {
          return (
            <Timer size="18" color={props.isSelect ? "#FFFFFF" : "#B4B6CD"} />
          );
        },
      },
      {
        name: "Reject",
        url: "reject",
        icon: (props: { isSelect: boolean }) => {
          return (
            <CloseCircle
              size="18"
              color={props.isSelect ? "#FFFFFF" : "#B4B6CD"}
            />
          );
        },
      },
      {
        name: "Completed",
        url: "completed",
        icon: (props: { isSelect: boolean }) => {
          return (
            <TickCircle
              size="18"
              color={props.isSelect ? "#FFFFFF" : "#B4B6CD"}
            />
          );
        },
      },
    ],
  },

  // {
  //   name: "Form Requisition",
  //   url: "/",
  //   subMenu: [
  //     {
  //       name: "In process",
  //       url: "in_process",
  //     },
  //     {
  //       name: "Reject",
  //       url: "reject",
  //     },
  //     {
  //       name: "Completed",
  //       url: "completed",
  //     },
  //   ],
  // },
];

export default data;

import Leave_Flow from "../leaveflow";
import { task } from "@/types/next-auth";

const CheckFlow = (props: { task: task }) => {
  const flowName = props.task?.data.flowName;
  if (flowName === "leave_flow") {
    return <Leave_Flow task={props.task} />;
  } else {
    return <>Flow Unavailable</>;
  }
};

export default CheckFlow;

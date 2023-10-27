import CarBooking_Flow from "../CarBooking";
import Leave_Flow from "../Leave/";
import { task } from "@/types/next-auth";

const CheckFlow = (props: { task: task }) => {
  const flowName = props.task?.data.flowName;
  console.log("flowName", flowName);
  if (flowName === "leave_flow") {
    return <Leave_Flow task={props.task} />;
  } else if (flowName === "Car Booking") {
    return <CarBooking_Flow task={props.task} />;
  } else {
    return <>Flow Unavailable</>;
  }
};

export default CheckFlow;

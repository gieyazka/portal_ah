import CarBooking_Flow from "../CarBooking";
import EGatePass_Flow from "../EGatePass";
import Leave_Flow from "../Leave/";
import { task } from "@/types/next-auth";

const CheckFlow = (props: { task: task }) => {
  const flowName = props.task?.data.flowName;
  if (flowName === "leave_flow") {
    return <Leave_Flow task={props.task} />;
  } else if (flowName === "Car Booking") {
    return <CarBooking_Flow task={props.task} />;
  } else if (flowName === "E-Gate-Pass") {
    return <EGatePass_Flow task={props.task} />;
  } else {
    return <>Flow Unavailable</>;
  }
};

export default CheckFlow;

import Leave_Flow from "../Leave";
import { task } from "@/types/next-auth";

const ActionFlow = (props: { task: task; type: string }) => {
  console.log(props);
  const flowName = props.task?.data.flowName;
  return (
    <div className="flex justify-center">
      <b className="text-xl">{props.type.toUpperCase()}</b>
    </div>
  );
};

export default ActionFlow;

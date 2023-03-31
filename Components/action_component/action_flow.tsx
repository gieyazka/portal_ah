import {
  Check,
  Clear,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Visibility,
} from "@mui/icons-material";

import { DialogStore } from "@/types/next-auth";
import { IconButton } from "@mui/material";
import { useDialogStore } from "@/store/store";

const Action_Flow = ({
  task,
  dialogStore,
  type,
}: {
  task: any;
  dialogStore: DialogStore;
  type: string;
}) => {
  const isApprove: boolean = type === "approve" ? true : false;
  return (
    <IconButton
      aria-label="delete"
      sx={{
        width: 36,
        height: 36,
        color: isApprove ? "green" : "red",
      }}
      onClick={async () => {
        dialogStore.onOpenDialog(task, isApprove ? "approve" : "reject");
      }}
    >
      {isApprove ? <Check /> : <Clear />}
    </IconButton>
  );
};

export default Action_Flow;

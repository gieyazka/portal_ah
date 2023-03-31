import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Visibility,
} from "@mui/icons-material";

import { DialogStore } from "@/types/next-auth";
import { IconButton } from "@mui/material";
import { useDialogStore } from "@/store/store";

const ViewSickFlow = ({
  task,
  dialogStore,
}: {
  task: any;
  dialogStore: DialogStore;
}) => {
  return (
    <IconButton
      aria-label="delete"
      sx={{ width: 36, height: 36 }}
      onClick={async () => {
        dialogStore.onOpenDialog(task);
      }}
    >
      <Visibility />
    </IconButton>
  );
};

export default ViewSickFlow;

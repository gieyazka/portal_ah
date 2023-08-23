import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Visibility,
} from "@mui/icons-material";

import { DialogStore } from "@/types/next-auth";
import { IconButton } from "@mui/material";
import { SWRResponse } from "swr";
import { useDialogStore } from "@/store/store";

const ViewSickFlow = ({
  task,
  dialogStore,
  swrResponse,
  iconStyle,
}: {
  task: any;
  dialogStore: DialogStore;
  swrResponse: SWRResponse | undefined;
  iconStyle?: string;
}) => {
  return (
    <IconButton
      className={iconStyle}
      aria-label="delete"
      sx={{ width: 36, height: 36 }}
      onClick={async () => {
        dialogStore.onOpenDialog({ task, swrResponse });
      }}
    >
      <Visibility />
    </IconButton>
  );
};

export default ViewSickFlow;

import { requester, task } from "@/types/next-auth";
import { usePreviewStore, useViewStore } from "@/store/store";

import Action_Log from "./action_log";
import Action_Log_Mobile from "./action_log_Mobile";
import React from "react";
import _apiFn from "@/utils/apiFn";

function ActionLog(props: { actionLog: any }) {
  const storePreview = usePreviewStore();
  const actionLog = props.actionLog;

  const viewStore = useViewStore();
  const [fileState, setFileState] = React.useState<{}[] | undefined>(undefined);
  console.log("fileState", fileState);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await Promise.all(
          actionLog?.filesURL?.map(async (d: string) => {
            const response = await _apiFn.getFileInfo(d);
            return response;
          })
        );
        setFileState(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (actionLog?.filesURL) {
      fetchData();
    }
  }, []);
  if (viewStore.isMd) {
    return (
      <Action_Log
        fileState={fileState}
        storePreview={storePreview}
        actionLog={actionLog}
      />
    );
  }
  return (
    <Action_Log_Mobile
      fileState={fileState}
      storePreview={storePreview}
      actionLog={actionLog}
    />
  );
}

export default ActionLog;

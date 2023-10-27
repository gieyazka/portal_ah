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

  if (viewStore.isMd) {
    return (
      <Action_Log
    
        storePreview={storePreview}
        actionLog={actionLog}
      />
    );
  }
  return (
    <Action_Log_Mobile
 
      storePreview={storePreview}
      actionLog={actionLog}
    />
  );
}

export default ActionLog;

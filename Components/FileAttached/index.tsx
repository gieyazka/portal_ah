import { requester, task } from "@/types/next-auth";
import { usePreviewStore, useViewStore } from "@/store/store";

import File_Attached from "./fileAttached";
import File_Attached_Mobile from "./fileAttached_Mobile";
import React from "react";
import _apiFn from "@/utils/apiFn";

function FileAttached(props: { task: task }) {
  const storePreview = usePreviewStore();
  const task = props.task;
  const requester = task.data.requester;
  const viewStore = useViewStore();
  const [fileState, setFileState] = React.useState<{}[] | undefined>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await Promise.all(
          task.data?.filesURL?.map(async (d: string) => {
            const response = await _apiFn.getFileInfo(d);
            return response;
          })
        );
        setFileState(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (task.data?.filesURL) {
      fetchData();
    }
  }, []);
  if (viewStore.isMd) {
    return <File_Attached fileState={fileState} storePreview={storePreview} />;
  }
  return (
    <File_Attached_Mobile fileState={fileState} storePreview={storePreview} />
  );
}

export default FileAttached;

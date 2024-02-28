import {
  BrokenImage,
  Download,
  ImageOutlined,
  PictureAsPdf,
} from "@mui/icons-material";
import { Tooltip, Typography } from "@mui/material";

import { FolderCross } from "iconsax-react";
import React from "react";
import _apiFn from "@/utils/apiFn";
import { approverList } from "@/types/next-auth";
import dayjs from "dayjs";
import fn from "@/utils/common";
import { usePreviewStore } from "@/store/store";

const FilePreview = (props: { approverData: approverList; index: number }) => {
  const storePreview = usePreviewStore();
  const { approverData, index } = props;
  const [fileState, setFileState] = React.useState<{}[] | undefined>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await Promise.all(
          approverData?.filesURL?.map(async (d: string) => {
            const response = await _apiFn.getFileInfo(d);
            return response;
          })
        );
        setFileState(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (approverData?.filesURL) {
      fetchData();
    }
  }, [approverData]);
  return (
    <>
      {fileState === undefined && (
        <div className="  flex-1 items-center gap-4 ">
          <div className="m-auto  flex ">
            <FolderCross size="16" color="#818181" />
            <Typography component="p" className="    px-2">
              No File
            </Typography>
          </div>
        </div>
      )}
      {fileState?.length !== 0 && (
        <div className=" gap-2 flex   w-full text-center">
          {fileState?.map((file: any, index: number) => {
            const fileType = file.name;
            let checkFile = fileType?.includes(".pdf")
              ? "pdf"
              : fn.isImageFile(fileType as string)
              ? "image"
              : "file";
            return (
              <>
                <div
                  onClick={() => {
                    fn.onPreviewFile(file.url, checkFile, storePreview);
                  }}
                  className="cursor-pointer    relative rounded-[10px] w-full  flex gap-2 items-center "
                >
                  <div className=" text-[#1D336D]">
                    {file.isError ? (
                      <BrokenImage />
                    ) : checkFile === "pdf" ? (
                      <PictureAsPdf className="    " />
                    ) : checkFile === "image" ? (
                      <ImageOutlined className=" " />
                    ) : (
                      <Download className="  " />
                    )}
                  </div>
                  <Typography
                    component="p"
                    className=" text-[#000] text-sm truncate  my-2"
                  >
                    {file.name}
                  </Typography>
                </div>
              </>
            );
          })}
        </div>
      )}
    </>
  );
};

export default FilePreview;

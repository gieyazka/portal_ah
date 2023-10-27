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
        console.log("19", approverData?.filesURL);
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
  console.log("", fileState);
  return (
    <div
      className={`rounded-xl flex flex-1  h-full relative    justify-between ${
        index % 2 !== 0 ? "bg-white" : "bg-[#F5F5F5]"
      }`}
    >
      <div
        className={`w-[10%] ${
          approverData.action === "Submit"
            ? "bg-[#1D336D]"
            : approverData.action === "Resubmit"
            ? "bg-[#FDBC3F]"
            : approverData.action === "Rejected" ||
              approverData.action === "HR Cancel"
            ? "bg-[#EB4242]"
            : approverData.action === "Cancel"
            ? "bg-gray-500"
            : "bg-[#86DC89]"
        }  py-2 rounded-l-xl  flex flex-col justify-center`}
      >
        <Typography
          className="text-lg  text-white font-semibold "
          component="p"
        >
          {approverData.action}
        </Typography>
      </div>
      <div className=" flex-1 flex flex-col justify-center">
        <Typography
          className="text-base text-[#464C59]  font-medium "
          component="p"
        >
          {approverData.name}
        </Typography>
      </div>
      <div className=" w-[10%] flex flex-col justify-center">
        <Typography
          className="text-base text-[#464C59]  font-medium "
          component="p"
        >
          {approverData.company}
        </Typography>
      </div>{" "}
      <div className=" flex-1 flex flex-col justify-center">
        <Typography
          className="text-base text-[#464C59]  font-medium "
          component="p"
        >
          {dayjs(approverData.date).format("DD/MM/YYYY @HH:mm:ss")}
        </Typography>
      </div>
      <div className=" flex-1 flex flex-col justify-center">
        <Tooltip title={approverData.remark ?? "-"}>
          <Typography
            className="text-base truncate text-[#464C59]  font-medium "
            component="p"
          >
            {approverData.remark}
          </Typography>
        </Tooltip>
      </div>
      <div className=" w-[20%]  flex flex-col justify-center">
        {approverData.filesURL === null ? (
          <div className="  flex-1  flex justify-center items-center gap-4 p-2">
            <div className="m-auto  items-center flex text-center">
              {/* <FolderOffOutlinedIcon className="" /> */}
              <FolderCross size="16" className="mx-2" color="#818181" />
              <Typography
                component="p"
                className="  text-[#818181] font-semibold"
              >
                No file attached
              </Typography>
            </div>
          </div>
        ) : (
          fileState?.length === 0 && <>Loading...</>
        )}
        {fileState?.length !== 0 && (
          <div className="m-auto gap-2 flex justify-center overflow-x-auto  w-full text-center">
            {fileState?.map((file: any, index: number) => {
              const fileType = file.name;
              let checkFile = fileType?.includes(".pdf")
                ? "pdf"
                : fn.isImageFile(fileType as string)
                ? "image"
                : "file";
              return (
                <>
                  <Tooltip
                    key={`image${index}`}
                    title={file.name}
                    placement="top"
                  >
                    <div
                      onClick={() => {
                        fn.onPreviewFile(file.url, checkFile, storePreview);
                      }}
                      className="cursor-pointer  w-2/5  relative rounded-[10px]  flex gap-2 items-center "
                    >
                      <div className="ml-2 text-[#1D336D]">
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
                        className=" text-[#000] text-sm truncate  py-2"
                      >
                        {file.name}
                      </Typography>
                    </div>
                  </Tooltip>
                </>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;

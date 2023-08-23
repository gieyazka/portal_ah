import { ArrowRight, FolderCross, User } from "iconsax-react";
import { Avatar, Tooltip, Typography } from "@mui/material";
import { requester, task } from "@/types/next-auth";

import ApproverStep from "./approver_step";
import DownloadIcon from "@mui/icons-material/Download";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import Image from "next/image";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { PictureAsPdf } from "@mui/icons-material";
import _ from "lodash";
import axios from "axios";
import dayjs from "dayjs";
import fn from "@/utils/common";
import { usePreviewStore } from "@/store/store";

const Requester = (props: { task: task }) => {
  const storePreview = usePreviewStore();
  const task = props.task;
  const requester = task.data.requester;

  return (
    <div className="  w-full h-full relative">
      <div
        className=" rounded-[10px] relative h-full   flex flex-col bg-white "
        style={{
          boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography
          component="p"
          className="text-xl bg-[#D4E8FC] py-2 rounded-t-[10px] text-[#1976D2]  font-bold px-2"
        >
          File attached
        </Typography>

        {task.data.filesURL === undefined ||
          (task.data.filesURL.length === 0 && (
            <div className="flex  flex-col flex-1 items-center gap-4 m-4  ">
              <div className="m-auto  text-center">
                {/* <FolderOffOutlinedIcon className="w-[12vh] h-[12vh]" /> */}
                <FolderCross size="48" className="mx-auto" color="#818181" />
                <Typography
                  component="p"
                  className="text-xl  text-[#818181] font-semibold"
                >
                  No file attached
                </Typography>
              </div>
            </div>
          ))}
        {task.data.filesURL !== undefined && task.data.filesURL.length > 0 && (
          <div className="flex flex-col flex-1 p-4 overflow-y-auto   ">
            <div className=" flex   flex-wrap gap-2 basis-[33%]  ">
              {task.data.filesURL.map((file: string, index: number) => {
                const fileName = _.last(file.split("/"));
                let checkFile = fileName?.includes("pdf")
                  ? "pdf"
                  : fn.isImageFile(fileName as string)
                  ? "image"
                  : "file";
                return (
                  <Tooltip
                    key={`image${index}`}
                    title={fileName}
                    placement="top"
                  >
                    <div
                      onClick={async () => {
                        await fn.onPreviewFile(file, checkFile, storePreview);
                      }}
                      className="cursor-pointer bg-[#F5F5F5] relative rounded-[10px] w-[31%] flex   gap-2 items-center justify-between"
                    >
                      <div className="ml-2 text-[#1D336D]">
                        {checkFile === "pdf" ? (
                          <PictureAsPdf className="    " />
                        ) : checkFile === "image" ? (
                          <ImageOutlinedIcon className=" " />
                        ) : (
                          <DownloadIcon className="  " />
                        )}
                      </div>
                      <Typography
                        component="p"
                        className=" text-[#818181] text-sm truncate  basis-[60%]  py-2"
                      >
                        {fileName}
                      </Typography>
                      <ArrowRight
                        size="24"
                        className="-rotate-45"
                        color="#464C59"
                      />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requester;

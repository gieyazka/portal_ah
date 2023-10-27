import { ArrowRight, FolderCross, User } from "iconsax-react";
import { Avatar, Tooltip, Typography } from "@mui/material";
import { BrokenImage, PictureAsPdf } from "@mui/icons-material";
import { previewStore, requester, task } from "@/types/next-auth";

import ApproverStep from "../approver_step";
import DownloadIcon from "@mui/icons-material/Download";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import Image from "next/image";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import React from "react";
import _ from "lodash";
import _apiFn from "@/utils/apiFn";
import axios from "axios";
import dayjs from "dayjs";
import fn from "@/utils/common";
import { usePreviewStore } from "@/store/store";

const FileAttached = ({
  fileState,
  storePreview,
}: {
  fileState: any;
  storePreview: previewStore;
}) => {
  console.log("fileState", fileState);
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

        {(fileState === undefined || fileState.length === 0) && (
          <div className="flex  flex-col flex-1 items-center flex-wrap gap-4 m-4  ">
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
        )}
        {fileState !== undefined && fileState.length > 0 && (
          <div className="flex flex-col flex-1 p-4 overflow-y-auto   ">
            <div className=" flex   flex-wrap gap-4 basis-[33%]  ">
              {fileState.map((file: any, index: number) => {
                const fileType = file.name;
                let checkFile = fileType?.includes(".pdf")
                  ? "pdf"
                  : fn.isImageFile(fileType as string)
                  ? "image"
                  : "file";
                return (
                  <Tooltip
                    key={`image${index}`}
                    title={file.name}
                    placement="top"
                  >
                    <div
                      onClick={async () => {
                        if (file.isError) {
                          return;
                        }
                        await fn.onPreviewFile(
                          file.url,
                          checkFile,
                          storePreview
                        );
                      }}
                      className="cursor-pointer bg-[#F5F5F5] relative rounded-[10px] w-[31%] flex   gap-2 items-center justify-between"
                    >
                      <div className="ml-2 text-[#1D336D]">
                        {file.isError ? (
                          <BrokenImage />
                        ) : checkFile === "pdf" ? (
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
                        {file.name}
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

export default FileAttached;

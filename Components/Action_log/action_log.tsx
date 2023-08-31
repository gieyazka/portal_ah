import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Tooltip,
  Typography,
} from "@mui/material";
import { Clear, Done, ExpandMore, PictureAsPdf } from "@mui/icons-material";
import { approverList, previewStore } from "@/types/next-auth";
import { usePreviewStore, useViewStore } from "@/store/store";

import DownloadIcon from "@mui/icons-material/Download";
import { FolderCross } from "iconsax-react";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import Image from "next/image";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import _ from "lodash";
import axios from "axios";
import dayjs from "dayjs";
import fn from "@/utils/common";

const Action_log = ({
  actionLog,
  storePreview,
  fileState,
}: {
  actionLog: approverList[] | undefined;
  storePreview: previewStore;
  fileState: any;
}) => {
  // console.log(actionLog);
  const viewStore = useViewStore();
  if (actionLog === undefined) {
    return <></>;
  }
  return (
    <div className=" pt-3 pb-2 w-full ">
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
          Action logs
        </Typography>
        <div className="flex flex-1 justify-between">
          <div
            className="py-2 text-center  whitespace-nowrap w-full  flex-1 font-medium"
            style={
              {
                // // width: key.width || "auto",
                // color: key.fontColor ? key.fontColor : "#3B4778",
                // backgroundColor: `${key.color || "#FFFFFF"}`,
                // borderTopLeftRadius: `${index === 0 ? "6px" : "0px"}`,
                // borderTopRightRadius: `${
                //   headerTable.length - 1 === index ? "6px" : "0px"
                // }`,
              }
            }
          >
            <div className="flex gap-1 flex-col justify-center mx-4 ">
              <div className="flex flex-1 text-[#1D366D] justify-between ">
                <Typography
                  className=" text-xl font-semibold w-[10%]"
                  component="p"
                >
                  Action
                </Typography>
                <Typography
                  className="text-xl font-semibold flex-1"
                  component="p"
                >
                  Name
                </Typography>
                <Typography
                  className="text-xl font-semibold  w-[10%]"
                  component="p"
                >
                  Company
                </Typography>
                <Typography
                  className="text-xl font-semibold flex-1"
                  component="p"
                >
                  Action date
                </Typography>
                <Typography
                  className="text-xl font-semibold flex-1"
                  component="p"
                >
                  Note
                </Typography>
                <Typography
                  className="text-xl font-semibold flex-1"
                  component="p"
                >
                  File
                </Typography>
              </div>
              {actionLog.map((approverData: approverList, index: number) => {
                // console.log("approverData", approverData);
                return (
                  <div
                    key={`action_${index}`}
                    className={`rounded-xl flex flex-1  h-full relative    justify-between ${
                      index % 2 !== 0 ? "bg-white" : "bg-[#F5F5F5]"
                    }`}
                  >
                    <div
                      className={`w-[10%] ${
                        approverData.action === "Submit"
                          ? "bg-[#1D336D]"
                          : approverData.action === "Resubmit"
                          ? "bg-[#FFE175]"
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
                        {dayjs(approverData.date).format(
                          "DD/MM/YYYY @HH:mm:ss"
                        )}
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
                      {fileState === undefined && (
                        <div className="  flex-1 items-center gap-4 p-2">
                          <div className="m-auto  items-center flex text-center">
                            {/* <FolderOffOutlinedIcon className="" /> */}
                            <FolderCross
                              size="16"
                              className="mx-2"
                              color="#818181"
                            />
                            <Typography
                              component="p"
                              className="  text-[#818181] font-semibold"
                            >
                              No file attached
                            </Typography>
                          </div>
                        </div>
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
                                      fn.onPreviewFile(
                                        file.name,
                                        checkFile,
                                        storePreview
                                      );
                                    }}
                                    className="cursor-pointer  w-2/5  relative rounded-[10px]  flex gap-2 items-center "
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
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Action_log;

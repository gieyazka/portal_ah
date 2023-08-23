import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
  stepConnectorClasses,
} from "@mui/material";
import {
  Block,
  Check,
  Clear,
  DisplaySettings,
  Done,
  ExpandMore,
  InsertDriveFile,
  PictureAsPdf,
} from "@mui/icons-material";
import { usePreviewStore, useViewStore } from "@/store/store";

import DownloadIcon from "@mui/icons-material/Download";
import { FolderCross } from "iconsax-react";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import Image from "next/image";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import _ from "lodash";
import { approverList } from "@/types/next-auth";
import axios from "axios";
import dayjs from "dayjs";
import fn from "@/utils/common";

const Action_log = (props: { actionLog: approverList[] | undefined }) => {
  const actionLog = props.actionLog;
  const storePreview = usePreviewStore();
  const handleClick = async (file: string, type: string) => {
    if (type === "pdf") {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_Strapi}${file}`, {
        responseType: "blob",
      });
      const pdfBlob = new Blob([res.data], {
        type: "application/pdf",
      });
      storePreview.onShowBackDrop(pdfBlob, "pdf");
    }

    if (type === "image") {
      storePreview.onShowBackDrop(
        `${process.env.NEXT_PUBLIC_Strapi}${file}`,
        "image"
      );
    }
    if (type === "file") {
      var link = document.createElement("a");
      link.setAttribute("href", `${process.env.NEXT_PUBLIC_Strapi}${file}`);
      link.click();
    }
  };
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
        <Accordion defaultExpanded>
          <AccordionSummary
            sx={{
              minHeight: 44,
              maxHeight: 44,
              "&.Mui-expanded": {
                minHeight: 44,
                maxHeight: 44,
              },
            }}
            className="p-0 bg-[#D4E8FC] rounded-t-[10px]"
            expandIcon={<ExpandMore />}
          >
            <Typography
              component="p"
              className="text-xl  py-2  text-[#1976D2]  font-bold px-2"
            >
              Action logs
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="p-0 flex w-full">
            <div className="flex-1 flex flex-col gap-2 p-2 w-full ">
              {actionLog.map((approverData: approverList, index: number) => {
                console.log("approverData", approverData);
                const isApproved = approverData.action !== "Rejected";
                const bgColor =
                  approverData.action === "Submit"
                    ? "bg-[#1D336D]"
                    : approverData.action === "Resubmit"
                    ? "bg-[#FFE175]"
                    : approverData.action === "Rejected" ||
                      approverData.action === "HR Cancel"
                    ? "bg-[#EB4242]"
                    : approverData.action === "Cancel"
                    ? "bg-gray-500"
                    : "bg-[#86DC89]";
                return (
                  <div
                    key={`action_${index}`}
                    className={`rounded-xl flex  flex-1  h-full relative gap-4    ${bgColor} bg-opacity-20 `}
                  >
                    <div
                      className={`w-[2.25rem] ${bgColor}  rounded-l-xl  flex flex-col justify-center text-center`}
                    >
                      <Typography
                        className="text-lg  text-white font-semibold "
                        component="p"
                      >
                        {approverData.action === "Submit" ? (
                          <InsertDriveFile />
                        ) : approverData.action === "Resubmit" ? (
                          <DisplaySettings />
                        ) : approverData.action === "Rejected" ||
                          approverData.action === "HR Cancel" ? (
                          <Clear />
                        ) : approverData.action === "Cancel" ? (
                          <Block />
                        ) : (
                          <Check />
                        )}
                      </Typography>
                    </div>
                    <div className="flex flex-col my-2  w-[calc(100%_-_3.25rem)]">
                      <div className=" flex-1 flex flex-col justify-center">
                        <Typography
                          className="text-base text-[#464C59]  font-semibold "
                          component="p"
                        >
                          {approverData.name}({approverData.company})
                        </Typography>
                      </div>
                      <div className=" w-[10%] flex flex-col justify-center">
                        <Typography
                          className="text-base text-[#464C59]  font-medium "
                          component="p"
                        >
                          {approverData.empid}
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
                      <div className=" flex-1 flex flex-col ">
                        <Tooltip title={approverData.remark ?? "-"}>
                          <Typography
                            className="text-base truncate text-[#464C59]  font-medium "
                            component="p"
                          >
                            Note : {approverData.remark}
                          </Typography>
                        </Tooltip>
                      </div>
                      <div className="flex-1 w-[calc(100%_-_1.25rem)] overflow-x-auto  flex flex-col ">
                        {(approverData.filesURL === null ||
                          approverData?.filesURL?.length === 0) && (
                          <div className="  flex-1 items-center gap-4 ">
                            <div className="m-auto  flex ">
                              {/* <FolderOffOutlinedIcon className="" /> */}
                              <FolderCross size="16" color="#818181" />
                              <Typography component="p" className="    px-2">
                                No File
                              </Typography>
                            </div>
                          </div>
                        )}
                        {approverData?.filesURL?.length !== 0 && (
                          <div className=" gap-2 flex   w-full text-center">
                            {approverData?.filesURL?.map(
                              (file: string, index: number) => {
                                const fileName = _.last(file.split("/"));
                                let checkFile = fileName?.includes("pdf")
                                  ? "pdf"
                                  : fn.isImageFile(fileName as string)
                                  ? "image"
                                  : "file";
                                return (
                                  <>
                                    <div
                                      onClick={() => {
                                        handleClick(file, checkFile);
                                      }}
                                      className="cursor-pointer    relative rounded-[10px] w-full  flex gap-2 items-center "
                                    >
                                      <div className=" text-[#1D336D]">
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
                                        className=" text-[#000] text-sm truncate  my-2"
                                      >
                                        {fileName}
                                      </Typography>
                                    </div>
                                  </>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default Action_log;

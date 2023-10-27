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
  BrokenImage,
  Check,
  Clear,
  DisplaySettings,
  Done,
  ExpandMore,
  InsertDriveFile,
  PictureAsPdf,
} from "@mui/icons-material";
import { approverList, previewStore } from "@/types/next-auth";
import { usePreviewStore, useViewStore } from "@/store/store";

import DownloadIcon from "@mui/icons-material/Download";
import FilePreview_Mobile from "./filePreview_Mobile";
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
}: // fileState,
{
  actionLog: approverList[] | undefined;
  storePreview: previewStore;
  // fileState: any;
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
                const isApproved = approverData.action !== "Rejected";
                const bgColor =
                  approverData.action === "Submit"
                    ? "bg-[#1D336D]"
                    : approverData.action === "Resubmit"
                    ? "bg-[#FDBC3F]"
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
                        <FilePreview_Mobile
                          key={`action_${index}`}
                          approverData={approverData}
                          index={index}
                        />
                    
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

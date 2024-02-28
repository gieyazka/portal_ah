import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  BrokenImage,
  Clear,
  Done,
  ExpandMore,
  PictureAsPdf,
} from "@mui/icons-material";
import { approverList, previewStore } from "@/types/next-auth";
import { usePreviewStore, useViewStore } from "@/store/store";

import ActionLogData from "./action_log_data";
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
            <div className="flex gap-1 flex-col justify-center mx-4  ">
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
                  className="text-xl font-semibold w-[24%]  "
                  component="p"
                >
                  Note
                </Typography>
                <Typography
                  className="text-xl font-semibold w-[20%]"
                  component="p"
                >
                  File
                </Typography>
              </div>
        
              {actionLog.map((approverData: approverList, index: number) => {
                // console.log("approverData", approverData);
                const oldApprover = approverData["0"]
                  ? { ...approverData["0"], ...approverData }
                  : approverData;
                return (
                  <ActionLogData
                    key={`action_${index}`}
                    approverData={oldApprover}
                    index={index}
                  />
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

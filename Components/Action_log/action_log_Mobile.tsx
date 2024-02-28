import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Step, StepContent, StepLabel, Stepper, Tooltip, Typography, stepConnectorClasses } from "@mui/material";
import { Block, BrokenImage, Check, Clear, DisplaySettings, Done, ExpandMore, InsertDriveFile, PictureAsPdf } from "@mui/icons-material";
import { approverList, previewStore } from "@/types/next-auth";
import { usePreviewStore, useViewStore } from "@/store/store";

import ActionLogData from "./action_log_data";
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
    <div className=' pt-3 pb-2 w-full '>
      <div
        className=' rounded-[10px] relative h-full   flex flex-col bg-white '
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
            className='p-0 bg-[#D4E8FC] rounded-t-[10px]'
            expandIcon={<ExpandMore />}
          >
            <Typography
              component='p'
              className='text-xl  py-2  text-[#1976D2]  font-bold px-2'
            >
              Action logs
            </Typography>
          </AccordionSummary>
          <AccordionDetails className='p-0 flex w-full'>
            <div className='flex-1 flex flex-col gap-2 p-2 w-full '>
              {actionLog.map((d: approverList, index: number) => {
                const approverData: approverList = d["0"] ? { ...d["0"], ...d } : d;

                return (
                  <ActionLogData
                    key={`action_${index}`}
                    approverData={approverData}
                    index={index}
                  />
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

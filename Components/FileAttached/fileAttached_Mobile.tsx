import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowRight, FolderCross, User } from "iconsax-react";
import { ExpandMore, PictureAsPdf } from "@mui/icons-material";
import { previewStore, requester, task } from "@/types/next-auth";

import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import _ from "lodash";
import fn from "@/utils/common";

const FileAttached = ({
  fileState,
  storePreview,
}: {
  fileState: any;
  storePreview: previewStore;
}) => {
  return (
    <div className="  w-full h-full relative">
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
              className="text-xl bg-[#D4E8FC] py-2 rounded-t-[10px] text-[#1976D2]  font-bold px-2"
            >
              File attached
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="p-0">
            {fileState === undefined && (
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
            )}
            {fileState !== undefined && fileState.length > 0 && (
              <div className="flex flex-col justify-center gap-2 flex-1 p-4   ">
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
                          await fn.onPreviewFile(
                            file.url,
                            checkFile,
                            storePreview
                          );
                        }}
                        className="cursor-pointer bg-[#F5F5F5] relative rounded-[10px] w-[100%] flex   gap-2 items-center justify-between"
                      >
                        <div className="px-2 flex gap-2 text-[#1D336D] w-full items-center">
                          {checkFile === "pdf" ? (
                            <PictureAsPdf className="    " />
                          ) : checkFile === "image" ? (
                            <ImageOutlinedIcon className=" " />
                          ) : (
                            <DownloadIcon className="  " />
                          )}

                          <Typography
                            component="p"
                            className=" text-[#818181] text-sm truncate  basis-[100%]  py-2"
                          >
                            {file.name}
                          </Typography>
                        </div>
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
            )}
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default FileAttached;

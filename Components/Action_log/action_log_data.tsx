import { Block, BrokenImage, Check, Clear, DisplaySettings, Download, ExpandMore, ImageOutlined, InsertDriveFile, PictureAsPdf } from "@mui/icons-material";
import { Tooltip, Typography } from "@mui/material";
import { usePreviewStore, useViewStore } from "@/store/store";

import FilePreview_Mobile from "./filePreview_Mobile";
import { FolderCross } from "iconsax-react";
import React from "react";
import RenderTxt from "../skeleton";
import _apiFn from "@/utils/apiFn";
import { approverList } from "@/types/next-auth";
import dayjs from "dayjs";
import fn from "@/utils/common";
import { useQuery } from "react-query";

const ActionLogData = (props: { approverData: approverList & { empId?: string }; index: number }) => {
  const storePreview = usePreviewStore();
  const { approverData, index } = props;
  const viewStore = useViewStore();
  const queryData = useQuery(
    ["employee", approverData.email, approverData?.empId],
    async () => {
      if (approverData.empId) {
        const userPayRoll = await _apiFn.getUserInfo(approverData?.empId);
        const data = { userPayRoll: userPayRoll.employee };
        return data;
      } else {
        return _apiFn.getUserProfile(approverData.email as string);
      }
    },
    {
      enabled: approverData?.name === undefined,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const approver: approverList & { type?: string } = React.useMemo(() => {
    if (queryData.data?.userPayRoll) {
      const userPayRoll = queryData.data?.userPayRoll;
      return { ...approverData, name: userPayRoll?.name_en, company: userPayRoll?.branch };
    }
    return approverData;
  }, [queryData.data]);
  const [fileState, setFileState] = React.useState<{}[] | undefined>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await Promise.all(
          approver?.filesURL?.map(async (d: string) => {
            const response = await _apiFn.getFileInfo(d);
            return response;
          })
        );
        setFileState(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (approver?.filesURL) {
      fetchData();
    }
  }, [approver]);

  const bgColor =
    approver.action === "Submit"
      ? "bg-[#1D336D]"
      : approver.action === "Resubmit"
      ? "bg-[#FDBC3F]"
      : approver.action === "Rejected" || approver.action === "HR Cancel"
      ? "bg-[#EB4242]"
      : approver.action === "Cancel"
      ? "bg-gray-500"
      : "bg-[#86DC89]";
  if (viewStore.isMd)
    return (
      <div className={`rounded-xl flex flex-1  h-full relative ${queryData.isLoading && "gap-2"}   justify-between ${index % 2 !== 0 ? "bg-white" : "bg-[#F5F5F5]"}`}>
        <div className={`w-[10%] ${bgColor}  py-2 rounded-l-xl  flex flex-col justify-center`}>
          <RenderTxt
            classes='text-lg  text-white font-semibold '
            txt={approver.action}
            isLoading={queryData.isLoading}
          />
          {/* <Typography
          className='text-lg  text-white font-semibold '
          component='p'
        >
          {approver.action}
        </Typography> */}
        </div>
        <div className=' flex-1 flex flex-col justify-center'>
          <RenderTxt
            classes='text-base text-[#464C59]  font-medium '
            txt={approver?.type ? approver.type?.charAt(0).toUpperCase() + approver.type?.slice(1) : approver.name}
            isLoading={queryData.isLoading}
          />
          {/* <Typography
          className='text-base text-[#464C59]  font-medium '
          component='p'
        >
          {approver.name}
        </Typography> */}
        </div>
        <div className=' w-[10%] flex flex-col justify-center'>
          <RenderTxt
            classes='text-base text-[#464C59]  font-medium '
            txt={approver?.type ? "-" : approver.company}
            isLoading={queryData.isLoading}
          />
        </div>{" "}
        <div className=' flex-1 flex flex-col justify-center'>
          <RenderTxt
            classes='text-base text-[#464C59]  font-medium '
            txt={dayjs(approver.date).format("DD/MM/YYYY @HH:mm:ss")}
            isLoading={queryData.isLoading}
          />
        </div>
        <div className=' w-[24%]  flex flex-col justify-center  '>
          {/* <Tooltip title={approver.remark ?? "-"}> */}

          <RenderTxt
            classes='text-base text-[#464C59]  font-medium '
            txt={approver.remark}
            isLoading={queryData.isLoading}
          />
          {/* </Tooltip> */}
        </div>
        <div className=' w-[20%]  flex flex-col justify-center'>
          {approver.filesURL === null ? (
            <div className='  flex-1  flex justify-center items-center gap-4 p-2'>
              <div className='m-auto  items-center flex text-center'>
                {/* <FolderOffOutlinedIcon className="" /> */}
                <FolderCross
                  size='16'
                  className='mx-2'
                  color='#818181'
                />
                <Typography
                  component='p'
                  className='  text-[#818181] font-semibold'
                >
                  No file attached
                </Typography>
              </div>
            </div>
          ) : (
            fileState?.length === 0 && <>Loading...</>
          )}
          {fileState?.length !== 0 && (
            <div className='m-auto gap-2 flex justify-center overflow-x-auto  w-full text-center'>
              {fileState?.map((file: any, index: number) => {
                const fileType = file.name;
                let checkFile = fileType?.includes(".pdf") ? "pdf" : fn.isImageFile(fileType as string) ? "image" : "file";
                return (
                  <>
                    <Tooltip
                      key={`image${index}`}
                      title={file.name}
                      placement='top'
                    >
                      <div
                        onClick={() => {
                          fn.onPreviewFile(file.url, checkFile, storePreview);
                        }}
                        className='cursor-pointer  w-2/5  relative rounded-[10px]  flex gap-2 items-center '
                      >
                        <div className='ml-2 text-[#1D336D]'>
                          {file.isError ? (
                            <BrokenImage />
                          ) : checkFile === "pdf" ? (
                            <PictureAsPdf className='    ' />
                          ) : checkFile === "image" ? (
                            <ImageOutlined className=' ' />
                          ) : (
                            <Download className='  ' />
                          )}
                        </div>
                        <Typography
                          component='p'
                          className=' text-[#000] text-sm truncate  py-2'
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
  else
    return (
      <div
        key={`action_${index}`}
        className={`rounded-xl flex  flex-1  h-full relative gap-4    ${bgColor} bg-opacity-20 `}
      >
        <div className={`w-[2.25rem] ${bgColor}  rounded-l-xl  flex flex-col justify-center text-center`}>
          <Typography
            className='text-lg  text-white font-semibold '
            component='p'
          >
            {approver.action === "Submit" ? (
              <InsertDriveFile />
            ) : approver.action === "Resubmit" ? (
              <DisplaySettings />
            ) : approver.action === "Rejected" || approver.action === "HR Cancel" ? (
              <Clear />
            ) : approver.action === "Cancel" ? (
              <Block />
            ) : (
              <Check />
            )}
          </Typography>
        </div>
        <div className='flex flex-col my-2  w-[calc(100%_-_3.25rem)]'>
          <div className=' flex-1 flex flex-col justify-center'>
            <Typography
              className='text-base text-[#464C59]  font-semibold '
              component='p'
            >
              {approver.type ? approver.type : `${approver.name}(${approver.company})`}
            </Typography>
          </div>
          <div className=' w-[10%] flex flex-col justify-center'>
            <Typography
              className='text-base text-[#464C59]  font-medium '
              component='p'
            >
              {approver.empid}
            </Typography>
          </div>{" "}
          <div className=' flex-1 flex flex-col justify-center'>
            <Typography
              className='text-base text-[#464C59]  font-medium '
              component='p'
            >
              {dayjs(approver.date).format("DD/MM/YYYY @HH:mm:ss")}
            </Typography>
          </div>
          <div className=' flex-1 flex flex-col '>
            <Tooltip title={approver.remark ?? "-"}>
              <Typography
                className='text-base truncate text-[#464C59]  font-medium '
                component='p'
              >
                Note {approver.remark}
              </Typography>
            </Tooltip>
          </div>
          <div className='flex-1 w-[calc(100%_-_1.25rem)] overflow-x-auto  flex flex-col '>
            <FilePreview_Mobile
              key={`action_${index}`}
              approverData={approver}
              index={index}
            />
          </div>
        </div>
      </div>
    );
};

export default ActionLogData;

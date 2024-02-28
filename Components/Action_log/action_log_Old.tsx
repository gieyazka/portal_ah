import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Typography,
} from "@mui/material";
import { Clear, Done, ExpandMore, PictureAsPdf } from "@mui/icons-material";
import { usePreviewStore, useViewStore } from "@/store/store";

import Image from "next/image";
import { approverList } from "@/types/next-auth";
import axios from "axios";
import dayjs from "dayjs";

const Action_log = (props: { actionLog: approverList[] | undefined }) => {
  const actionLog = props.actionLog;
  const storePreview = usePreviewStore();
  
  // console.log(actionLog);
  const viewStore = useViewStore();
  if (actionLog === undefined) {
    return <></>;
  }
  return (
    <div className="md:px-4 pt-3 pb-2 w-full ">
      <div className=" border-2 border-[#1D336D] rounded-lg p-2 relative">
        <p className="text-xl absolute -top-2 -translate-y-2 font-bold bg-white px-2">
          Action Log
        </p>
        {viewStore.isMd && (
          <Accordion className="mt-4 mx-2" expanded={false}>
            <AccordionSummary expandIcon={<div className="w-6" />}>
              <div className="  flex justify-between w-full text-center">
                <div className="basis-1/5 flex-grow">No.</div>
                <div className="basis-1/5 flex-grow">Name</div>
                <div className="basis-1/5 flex-grow">Action</div>
                <div className="basis-1/5 flex-grow">Action Date</div>
                <div className="basis-1/5 flex-grow">Remark</div>
              </div>
            </AccordionSummary>
          </Accordion>
        )}
        {actionLog.map((approverData: approverList, index: number) => {
          return (
            <Accordion key={`${approverData.name}_${index}`} className=" mt-4 mx-2 ">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                {" "}
                {viewStore.isMd ? (
                  <div className="flex justify-between w-full text-center">
                    <div className="basis-1/5 flex-grow">{index + 1}</div>
                    <div className="basis-1/5 flex-grow">
                      {approverData.name}
                    </div>
                    <div className="basis-1/5 flex-grow">
                      {approverData.action && (
                        <Chip
                          label={approverData.action}
                          icon={
                            approverData.action === "Approved" ? (
                              <Done />
                            ) : (
                              <Clear />
                            )
                          }
                          color={
                            approverData.action === "Approved"
                              ? "success"
                              : "error"
                          }
                        />
                      )}
                    </div>
                    <div className="basis-1/5 flex-grow">
                      {dayjs(approverData.date).format("DD/MM/YYYY HH:mm")}
                    </div>
                    <div className="basis-1/5 flex-grow">
                      {approverData.remark && approverData.remark.length > 20
                        ? approverData.remark?.slice(0, 17) + "..."
                        : approverData.remark}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between  space-y-2 w-full text-center">
                    <div className="basis-1/5 flex-grow">
                      {approverData.name}
                    </div>
                    <div className="basis-1/5 flex-grow">
                      {approverData.action && (
                        <Chip
                          label={approverData.action}
                          icon={
                            approverData.action === "Approved" ? (
                              <Done />
                            ) : (
                              <Clear />
                            )
                          }
                          color={
                            approverData.action === "Approved"
                              ? "success"
                              : "error"
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex md:flex-row flex-col  text-xs md:text-lg">
                  <div className="flex flex-col justify-center basis-3/5 ">
                    <p>
                      <b>Position :</b> {approverData.position}
                    </p>
                    <p>
                      <b>Employee ID :</b> {approverData.empid}
                    </p>
                    <p>
                      <b>Email :</b> {approverData.email}
                    </p>
                  </div>
                  <div className="flex flex-col ">
                    <p>
                      <b>Company :</b> {approverData.company}
                    </p>
                    <p>
                      <b>Department :</b> {approverData.department}
                    </p>
                    <p>
                      <b>Section :</b> {approverData.section}
                    </p>
                    {approverData.sub_section && (
                      <p>
                        <b>Sub Section :</b> {approverData.sub_section}
                      </p>
                    )}
                  </div>
                  <hr className="my-2" />
                </div>
                <hr className="my-2" />
                <div className="flex flex-col ">
                  <p>
                    <b>Remark</b> :{" "}
                  </p>
                  <p>{approverData.remark}</p>
                </div>
                {approverData.filesURL?.map((file: string) => {
                  let isPdf = false;
                  if (file.includes(".pdf")) {
                    isPdf = true;
                    return (
                      <>
                        {/* {process.env.NEXT_PUBLIC_Strapi_Org}
                          {file} */}
                        <div className="relative text-center h-24 w-24">
                          <div
                            onClick={async () => {
                              const res = await axios.get(
                                `${process.env.NEXT_PUBLIC_Strapi_Org}${file}`,
                                {
                                  responseType: "blob",
                                }
                              );
                              const pdfBlob = new Blob([res.data], {
                                type: "application/pdf",
                              });
                              storePreview.onShowBackDrop(pdfBlob, "pdf");
                            }}
                            className="flex items-center border-2 rounded-md h-full w-full border-[#1D336D] "
                          >
                            <PictureAsPdf className="flex-1  text-[#1D336D]  " />
                          </div>
                        </div>
                      </>
                    );
                  }
                  return (
                    <div key={file} className="flex h-24 w-24 relative">
                      <Image
                        placeholder="blur"
                        blurDataURL="/assets/image-placeholder.jpg"
                        onClick={() =>
                          storePreview.onShowBackDrop(
                            `${process.env.NEXT_PUBLIC_Strapi_Org}${file}`,
                            "image"
                          )
                        }
                        src={`${process.env.NEXT_PUBLIC_Strapi_Org}${file}`}
                        // className='w-full h-full'
                        fill
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                        }}
                        // width={60}
                        // height={60}
                        alt={""}
                      />
                    </div>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default Action_log;

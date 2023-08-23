"use client";

import { Backdrop, Dialog, DialogContent } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";

import { Clear } from "@mui/icons-material";
import Image from "next/image";
import { usePreviewStore } from "@/store/store";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const Preview_Backdrop = () => {
  const storePreview = usePreviewStore();
  return (
    <Dialog
      open={storePreview.open}
      onClick={() => storePreview.onHideBackDrop()}
      className="z-50 font-[Bai Jamjuree] rounded-[10px]"
      fullWidth={true}
      maxWidth={false}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <div className="flex justify-end  items-center py-2 px-4 bg-[#EEF1F8]">
        <Clear
          className="ml-6 cursor-pointer text-4xl"
          onClick={() => storePreview.onHideBackDrop()}
        />
      </div>
      <DialogContent dividers={true}>
        {storePreview.file !== undefined &&
          (storePreview.type === "file" ? (
            <div className="w-[100vw] h-[100vh] text-center items-center">
              <div className="flex justify-end mr-2">
                <Clear className="cursor-pointer" />
              </div>
              <iframe
                className="mx-auto"
                src={storePreview.file}
                // src={storePreview.file + "#toolbar=0"}
                width="80%"
                height="100%"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              ></iframe>
            </div>
          ) : storePreview.type === "image" ? (
            <div className=" h-[70vh] text-center items-center ">
              <div className=" h-full flex flex-col justify-center">
                {/* test */}
                <Image
                  className="mx-auto"
                  src={storePreview.file}
                  // fill={true}

                  width={600}
                  height={600}
                  alt={"showimage"}
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-[80vh] text-center items-center">
              <PreviewPDF file={storePreview.file} />
              {/* <iframe
                className="mx-auto"
                src={storePreview.file + "#toolbar=0"}
                width="100%"
                height="100%"
              ></iframe> */}
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
};

const PreviewPDF = ({ file }: { file: any }) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  console.log("file", file);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={console.error}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};

export default Preview_Backdrop;

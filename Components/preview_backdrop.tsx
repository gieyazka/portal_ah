import { Backdrop } from "@mui/material";
import { Clear } from "@mui/icons-material";
import Image from "next/image";
import { usePreviewStore } from "@/store/store";

const Preview_Backdrop = () => {
  const storePreview = usePreviewStore();
  console.log(storePreview);
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: 999 }}
      open={storePreview.open}
      onClick={() => storePreview.onHideBackDrop()}
    >
      {storePreview.file !== undefined &&
        (storePreview.type === "image" ? (
          <Image
            src={storePreview.file}
            layout="fill"
            objectFit="contain"
            alt={"showimage"}
          />
        ) : (
          <div className="w-[100vw] h-[100vh] text-center">
            <div className="flex justify-end mr-2">
              <Clear className="cursor-pointer" />
            </div>
            <iframe
              src={storePreview.file + "#toolbar=0"}
              width="100%"
              height="100%"
            ></iframe>
          </div>
        ))}
    </Backdrop>
  );
};

export default Preview_Backdrop;

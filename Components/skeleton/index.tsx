import { Skeleton, Typography } from "@mui/material";

import { FC } from "react";
import { RenderTxtProps } from "@/types/common";

const RenderTxt: FC<RenderTxtProps> = (props) => {
  const { txt, isLoading = false, classes = "text-sm" } = props;

  return (
    <>
      {isLoading ? (
        <Skeleton
          variant='text'
          //   sx={{ fontSize: "16px" }}
          className={`${classes}`}
        />
      ) : (
        <Typography
          className={`${classes}`}
          component='p'
        >
          {txt}
        </Typography>
      )}
    </>
  );
};
export default RenderTxt;

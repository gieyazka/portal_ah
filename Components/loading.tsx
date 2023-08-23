import { Backdrop, CircularProgress } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { useLoading, useSnackbarStore } from "@/store/store";

import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const RenderLoading = () => {
  const loadingStore = useLoading();

  return (
    <Backdrop sx={{ color: "#fff", zIndex: 999 }} open={loadingStore.isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default RenderLoading;

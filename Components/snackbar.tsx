import MuiAlert, { AlertProps } from "@mui/material/Alert";
import React, { useEffect, useState } from "react";

import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import { useSnackbarStore } from "@/store/store";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CountdownSnackbar = () => {
  const snackbarStore = useSnackbarStore();
  const [countdown, setCountdown] = useState(2); // Initial countdown value
  const [progress, setProgress] = useState(100); // Initial progress value
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (snackbarStore.open && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 0.1);
        setProgress((countdown - 0.1) * 100/20); // Adjust based on the total countdown duration
      }, 100);
      if (countdown.toFixed(1) === "0.1") {
        handleClose();
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [snackbarStore.open, countdown]);

  const handleClose = () => {
    setCountdown(2);
    setProgress(100);
    snackbarStore.closeSnackbar();
  };

  return (
    <Snackbar
      open={snackbarStore.open}
      // autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <div>
        <Alert
          sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          onClose={handleClose}
          severity={snackbarStore.type}
        >
          {snackbarStore.message}
        </Alert>
        <LinearProgress
          sx={{
            borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px' ,
            padding: 0,
            backgroundColor: "green",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "red",
            },
          }}
          variant="determinate"
          value={snackbarStore.open ? progress : 0}
        />
      </div>
    </Snackbar>
  );
};

export default CountdownSnackbar;

"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { SessionProvider } from "next-auth/react";
import axios from "axios";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SessionProvider>{children}</SessionProvider>
    </LocalizationProvider>
  );
  // return <div {...user}>{children}</div>;
}

"use client";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();
export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = createTheme({
    typography: {
      fontFamily: "Bai Jamjuree",
    },
    palette: {
      primary: {
        main: "#1D336D",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SessionProvider>{children}</SessionProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
  // return <div {...user}>{children}</div>;
}

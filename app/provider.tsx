"use client";

import { I18nextProvider, initReactI18next } from "react-i18next";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "react-query";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React from 'react'
import { SessionProvider } from "next-auth/react";
import i18n from "i18next";

const queryClient = new QueryClient();
const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
    },
  },
  fr: {
    translation: {
      "Welcome to React": "Bienvenue à React et react-i18next",
    },
  },
};
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
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
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SessionProvider>
              <React.Suspense>{children}</React.Suspense>
            </SessionProvider>
          </LocalizationProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
  // return <div {...user}>{children}</div>;
}

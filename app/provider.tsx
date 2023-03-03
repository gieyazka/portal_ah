"use client";

import { SessionProvider } from "next-auth/react";
import axios from "axios";

export default function Providers({ children }: { children: React.ReactNode }) {


  return <SessionProvider>{children}</SessionProvider>; 
  // return <div {...user}>{children}</div>;
}

import "../styles/globals.css";

import Providers from "./provider";
import { SessionProvider } from "next-auth/react";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //@ts-ignore
  // const session = await unstable_getServerSession(authOptions);
  // console.log(Providers);

  return (
    <html>
      <head></head>
      <body>
          <Providers>{children}</Providers>
      </body>
    </html>
  )
}

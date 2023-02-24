import { SessionProvider } from "next-auth/react";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log(session);

  return (
    <html>
      <head />
      <body>
          <div className="max-w-screen overflow-hidden">
            <div className="flex">
              <div className="bg-green-500 h-screen w-16 text-center">sdsd</div>
              <div className="flex flex-col flex-1">
                <div className="bg-red-500 h-16 ">asdsajdgash</div>
                <div className="overflow-auto w-[calc(100vw_-_4rem)]  h-[calc(100vh_-_4rem)]">{children}</div>
              </div>
            </div>
          </div>
      </body>
    </html>
  );
}

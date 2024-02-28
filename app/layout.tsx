import "../styles/globals.css";
import "@fontsource/bai-jamjuree";

import type { Metadata } from "next";
import RenderComponent from "./render";

export const metadata: Metadata = {
  title: "E-Workflow Portal",
  icons: "/assets/icon_portal.png",
  description: "...",
};
function RootLayout({ children }: { children: React.ReactNode }) {
  // console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  return (
    <html style={{ height: "100vh" }}>
      <head>
        <meta name="E-Workflow Portal" content="PWA App" />

        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-2048-2732.jpg"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-1668-2224.jpg"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-1536-2048.jpg"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-1125-2436.jpg"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-1242-2208.jpg"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-750-1334.jpg"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/pwa/apple-splash-640-1136.jpg"
          sizes="640x1136"
        />

        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>E-Workflow Portal</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="apple-touch-icon" href="/assets/icon_portal.png"></link>
        <link rel="icon" href="/assets/icon_portal.png" />
      </head>
      {/* <title> E-Workflow Portal</title> */}
      <body style={{ fontFamily: "Bai Jamjuree" }}>
        <RenderComponent>{children}</RenderComponent>
      </body>
    </html>
  );
}

export default RootLayout;

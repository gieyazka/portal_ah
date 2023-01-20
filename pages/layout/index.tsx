import { signIn, signOut, useSession } from "next-auth/react";

import { Context } from "vm";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { getSession } from "next-auth/react";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {JSON.stringify(session)} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
        <h1 className=" text-red-400">asdasmldashdgashdgh</h1>
      </main>
    </>
  );
}

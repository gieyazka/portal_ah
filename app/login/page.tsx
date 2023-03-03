"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useRef } from "react";
import useSWR, { Fetcher, Key } from "swr";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { use } from "react";
import { useRouter } from "next/navigation";

// import { ServerStyleSheets } from '@mui/styles';

const fetcher: Fetcher<any, string> = (url: string) =>
  fetch(url).then((res) => res.json());

export default function SignIn({}) {
  const usernameRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const router = useRouter();
  // const providers = use(getProviders());

  // const { data, error, isLoading } = useSWR('/api/auth/providers', fetcher)

  // if (error) return <div>failed to load</div>
  // if (isLoading) return <div>loading...</div>
  // {
  //   console.log(data.credentials.id);

  // }
  const onLogin = async (username: string, password: string) => {
    let response = await signIn("credentials", {
      // let response = await signIn(data.credentials.id, {
      username,
      password,
      redirect: false,
      callbackUrl: "/menu",
    })
      .then((error) => error)
      .catch((error) => error);
    console.log(response);
    if (response.status === 200) {
      ("use client");
      console.log(response.url);

      router.push(response.url);
    }
    // await signInStrapi(username, password);
  };
  return (
    <>
      <div className="flex flex-col bg-gray-200 w-screen h-screen items-center">
        <Typography variant="h2" color="initial" className="mt-12 ">
          APP NAME
        </Typography>

        <div className="flex flex-col w-2/4">
          <TextField
            className="my-4"
            id=""
            label="Username"
            // defaultValue={"dsfdsf"}
            // InputLabelProps={{ shrink: true }}
            inputRef={usernameRef}
            // onChange={}
          />

          <TextField id="" label="Password" inputRef={passwordRef} />
        </div>
        <Button
          variant="contained"
          className="bg-blue-500 mt-4"
          onClick={() =>
            onLogin(usernameRef.current.value, passwordRef.current.value)
          }
        >
          Sign In
        </Button>
      </div>
    </>
  );
}

// export async function getServerSideProps() {
//   const providers = await getProviders();
//   return {
//     props: { providers },
//   };
// }

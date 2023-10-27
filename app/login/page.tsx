"use client";

import {
  Avatar,
  Box,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useLoading, useViewStore } from "@/store/store";
import useSWR, { Fetcher, Key } from "swr";

import Button from "@mui/material/Button";
import { Copyright } from "@mui/icons-material";
import Head from "next/head";
import Image from "next/image";
import JWT from "expo-jwt";
import Link from "next/link";
import LockOutlinedIcon from "@mui/icons-material/LooksOutlined";
import { LoginCurve } from "iconsax-react";
import React from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import fn from "@/utils/common";
import { getValue } from "@mui/system";
import { use } from "react";
import { useRouter } from "next/navigation";

// import { ServerStyleSheets } from '@mui/styles';

const fetcher: Fetcher<any, string> = (url: string) =>
  fetch(url).then((res) => res.json());

export default function SignIn({}) {
  //

  const theme = useTheme();
  const isMdCheck = useMediaQuery(theme.breakpoints.up("md"));
  useEffect(() => {
    viewStore.setMd(isMdCheck);
  }, [isMdCheck]);
  const viewStore = useViewStore();
  const router = useRouter();
  const loadingStore = useLoading();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      remember: false,
      username: "",
      password: "",
    },
  });

  React.useEffect(() => {
    getProviders().then((d) => {
      console.log("provider", d);
    });
  });

  React.useEffect(() => {
    const remember = localStorage.getItem("userRemember") ?? null;
    if (remember) {
      const dataRemember = JWT.decode<any>(
        remember,
        process.env.NEXT_PUBLIC_JWT_KEY as string
      );
      setValue("username", dataRemember.username);
      setValue("password", dataRemember.password);
      setValue("remember", true);
    }
  }, []);
  const onLogin: SubmitHandler<any> = async (data: {
    username: string;
    password: string;
    remember: boolean;
  }) => {
    return null;
    data.username = data?.username?.toUpperCase();

    const { username, password } = data;
    if (username === "" || username === undefined) {
      fn.callToast({
        title: "Please input username",
        type: "error",
      });
      return;
    }
    if (password === "" || password === undefined) {
      fn.callToast({
        title: "Please input password",
        type: "error",
      });
      return;
    }
    loadingStore.setLoading(true);
    let response = await signIn("credentials", {
      // let response = await signIn(data.credentials.id, {
      username,
      password,
      redirect: false,
      callbackUrl: "/menu/my_action?current=job_pending",
      // callbackUrl: "/menu/my_task?current=in_process",
    })
      .then((res) => res)
      .catch((error) => error);
    if (data.remember) {
      const jwt = JWT.encode(
        { username, password },
        process.env.NEXT_PUBLIC_JWT_KEY as string
      );
      localStorage.setItem("userRemember", jwt);
    } else {
      localStorage.removeItem("userRemember");
    }
    loadingStore.setLoading(false);

    if (response.status === 200) {
      fn.callToast({
        title: "Login Success",
        type: "success",
      });
      router.push(response.url);
    } else {
      console.log("response", response);
      fn.callToast({
        title: "Login Failed: Please check your username  and password",
        type: "error",
      });
    }
    // await signInStrapi(username, password);
  };
  if (viewStore.isMd === undefined) {
    return <div>Loading ...</div>;
  }
  if (!viewStore.isMd) {
    return (
      <div
        className="h-screen w-screen relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1D366D 0%, #6B739C 100%)",
        }}
      >
        <Head>
          <title>Page Title</title>
        </Head>
        <div className="w-[9.75rem] h-[9.75rem] rounded-full bg-transparent absolute left-[2.75rem] -top-[5.625rem] border-[#1D336D] border-[1rem]"></div>
        <div className="bg-[#6b739c] w-[1rem] h-[1rem]  rounded-full absolute top-[3.125rem] left-1/2 -translate-x-1/2 "></div>
        <div className="w-[9.75rem] h-[9.75rem] rounded-full bg-transparent absolute left-[17.75rem] top-[13.125rem] border-[#1D336D] border-[1rem]"></div>
        <div className="w-[9.75rem] h-[9.75rem] rounded-full bg-transparent absolute -left-[2.25rem] bottom-[2rem] border-[#6b739c] border-[1rem]"></div>
        <div className="w-[5.95rem] h-[5.95rem] rounded-full bg-transparent absolute left-[4.5rem] bottom-[3.875rem] border-[#1D336D] border-[0.625rem]"></div>
        <div className="bg-[#8F94B4] w-[1rem] h-[1rem]  rounded-full absolute bottom-[1.75rem] right-[6rem] -translate-x-1/2 "></div>
        <div className="w-[10.75rem] h-[10.75rem] rounded-full bg-transparent absolute -right-[5.5rem] -bottom-[5.25rem] border-[#475384] border-[1.25rem]"></div>
        <div className="text-center w-[22.5rem] h-auto bg-[#EEF1F8] rounded-[20px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
          {/* h-[36.5rem */}
          <Image
            className=" relative mx-auto items-center mt-[2.25rem]
            "
            alt="Picture of the author"
            src="/assets/aapico-logo.png"
            // src="/assets/loginPage.webp"
            width={56}
            height={56}
          />
          <Typography
            className="text-3xl mt-[4px]  font-bold text-[#1D336D] "
            component="p"
          >
            Sign In
          </Typography>
          <Typography
            className="text-2xl mt-[4px]  font-bold text-[#1D336D] "
            component="p"
          >
            E-WorkFlow Portal
          </Typography>

          <div className="flex gap-2">
            <Button
              variant="contained"
              className="bg-[#1D336D] px-6 mx-auto rounded-[32px] text-xl font-semibold"
              sx={{ mt: 3, mb: 2, width: 124 }}
              onClick={async () => {
                let response = await signIn("azure-ad-AH", {
                  redirect: false,
                  callbackUrl: "/menu/my_action?current=job_pending",
                  // callbackUrl: "/menu/my_task?current=in_process",
                })
                  .then((res) => res)
                  .catch((error) => {
                    console.log("error", error);
                    return error;
                  });
              }}
            >
              AAPICO
            </Button>
            <Button
              variant="contained"
              className="bg-[#1D336D] px-6 mx-auto rounded-[32px] text-xl font-semibold"
              sx={{ mt: 3, mb: 2, width: 124 }}
              onClick={async () => {
                let response = await signIn("azure-ad-AS", {
                  redirect: false,
                  callbackUrl: "/menu/my_action?current=job_pending",
                  // callbackUrl: "/menu/my_task?current=in_process",
                })
                  .then((res) => res)
                  .catch((error) => {
                    console.log("error", error);
                    return error;
                  });
              }}
            >
              ASICO
            </Button>
          </div>
          <Typography component="p" className="text-[#818181] my-3">
            <Copyright sx={{}} /> Copyright AAPICO 2023
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex  max-w-screen  flex-col-reverse md:flex-row h-screen sm:items-center md:items-center">
        <CssBaseline />
        {/* <div className="flex sm:flex-col-reverse  lg:flex-row h-screen sm:items-center md:items-center"> */}
        <div
          style={{
            background: " linear-gradient(135deg, #1D366D 0%, #6B739C 100%)",
            // backgroundImage: "url(/assets/blobBg.svg)",
            boxShadow: "4px 4px 10.5 0px rgba(0, 0, 0, 0.15)",
          }}
          className="relative hidden md:block md:h-full basis-[777px] overflow-hidden"
          // className="relative hidden md:block md:h-full basis-[777px]"
        >
          <div
            className="border-[#1D336D] border-[40px] rounded-full absolute " // 184*100 /777
            // className="border-[#1D336D] border-[40px] rounded-full absolute left-[126px] top-[-184px]"
            style={{
              width: `457px`,
              height: `457px`,
              top: `-183px`,
              left: `126px`,
              // width: `24vw`,
              // height: `24vw`,
              // top: `-17vh`,
              // left: `6.5vw`,
            }}
          ></div>
          <div
            className="border-[#1C2E5A] border-[40px] rounded-full absolute  "
            style={{
              width: `244px`,
              height: `244px`,
              top: `-100px`,
              left: `466px`,
              // width: `13vw`,
              // height: `13vw`,
              // top: `-9.25vh`,
              // left: `24vw`,
            }}
          ></div>

          <div
            className="bg-[#475384]  rounded-full absolute  "
            style={{
              width: `24px`,
              height: `24px`,
              top: `185px`,
              left: `116px`,
              // width: `1.25vw`,
              // height: `1.25vw`,
              // top: `17.22vh`,
              // left: `5vw`,
            }}
          ></div>

          <div
            className="border-[#1D336D] border-[40px] rounded-full absolute " // 184*100 /777
            // className="border-[#1D336D] border-[40px] rounded-full absolute left-[126px] top-[-184px]"
            style={{
              width: `457px`,
              height: `457px`,
              bottom: `132.96px`,
              left: `-224.75px`,
              // width: `24vw`,
              // height: `24vw`,
              // top: `36.3vh`,
              // left: `-17vw`,
            }}
          ></div>
          <div
            className="border-[#6b739c] border-[40px] rounded-full absolute " // 184*100 /777
            style={{
              width: `331.47px`,
              height: `331.47px`,
              bottom: `28.37px`,
              left: `-108.38px`,
              // width: `17.2vw`,
              // height: `17.2vw`,
              // top: `59.16vh`,
              // left: `-9vw`,
            }}
          ></div>
          <div
            className="bg-[#1D336D]  rounded-full absolute  "
            style={{
              width: `46px`,
              height: `46px`,
              bottom: `72px`,
              left: `230px`,
              // width: `1.25vw`,
              // height: `1.25vw`,
              // top: `17.22vh`,
              // left: `5vw`,
            }}
          ></div>

          <div
            className="border-[#6b739c] border-[40px] rounded-full absolute " // 184*100 /777
            style={{
              width: `331.47px`,
              height: `331.47px`,
              bottom: `85px`,
              right: `-162.6px`,
              // width: `17.2vw`,
              // height: `17.2vw`,
              // top: `59.16vh`,
              // left: `-9vw`,
            }}
          ></div>

          <div className="absolute -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2">
            <Image
              className="object-contain relative mx-auto items-center"
              alt="Picture of the author"
              src="/assets/logoNoTxt.png"
              // src="/assets/loginPage.webp"
              width={164}
              height={174}
            />
            <p className="text-white text-4xl text-center text-bold">
              {" "}
              AAPICO{" "}
            </p>
          </div>
        </div>
        <div className="flex flex-col  gap-2 items-center justify-center shadow-md h-full flex-1 px-24 ">
          <Typography className="font-bold text-4xl">Sign In</Typography>
          <Typography
            component="p"
            className="text-bold text-3xl text-[#1D336D]"
          >
            E-Workflow Portal
          </Typography>
          <div className="flex gap-4">
            <Button
              variant="contained"
              className="bg-[#1D336D] px-6 mx-auto rounded-[32px] text-xl font-semibold"
              sx={{ mt: 3, mb: 2, width: 224 }}
              onClick={async () => {
                let response = await signIn("azure-ad-AH", {
                  redirect: false,
                  callbackUrl: "/menu/my_action?current=job_pending",
                  // callbackUrl: "/menu/my_task?current=in_process",
                })
                  .then((res) => res)
                  .catch((error) => {
                    console.log("error", error);
                    return error;
                  });
              }}
            >
              AAPICO
            </Button>
            <Button
              variant="contained"
              className="bg-[#1D336D] px-6 mx-auto rounded-[32px] text-xl font-semibold"
              sx={{ mt: 3, mb: 2, width: 224 }}
              onClick={async () => {
                let response = await signIn("azure-ad-AS", {
                  redirect: false,
                  callbackUrl: "/menu/my_action?current=job_pending",
                  // callbackUrl: "/menu/my_task?current=in_process",
                })
                  .then((res) => res)
                  .catch((error) => {
                    console.log("error", error);
                    return error;
                  });
              }}
            >
              ASICO
            </Button>
          </div>
          <Typography component="p" className="text-[#818181]">
            <Copyright sx={{}} /> Copyright AAPICO 2023
          </Typography>
        </div>
      </div>{" "}
    </>
  );
}

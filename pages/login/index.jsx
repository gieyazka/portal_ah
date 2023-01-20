import { getProviders, signIn } from "next-auth/react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRef } from "react";
import { useRouter } from "next/router";

export default function SignIn({ providers }) {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();
  const onLogin = async (username, password) => {
    let response = await signIn(providers.credentials.id, {
      username,
      password,
      redirect: false,
      callbackUrl: "/layout",
    })
      .then((error) => error)
      .catch((error) => error);
    console.log(response);
    if (response.status === 200) {
      router.push(response.url);
    }
    // await signInStrapi(username, password);
  };
  return (
    <>
      <div className="flex flex-col bg-gray-200 w-screen h-screen items-center">
        <Typography variant="h2" color="initial" className="mt-12">
          APP NAME
        </Typography>

        <div name="form" className="flex flex-col w-2/4">
          <TextField
            className="my-4"
            id=""
            label="Username"
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

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const signInStrapi = async (identifier: string, password: string) => {
  const res = await axios.post(
    "http://agrappl03.aapico.com:1340/api/auth/local",
    {
      identifier,
      password,
    },
    {
      validateStatus: function (status) {
        return status < 500;
      },
    }
  );
  return res;
};

const useUSer = () => {
  const user = useSWR("/api/auth/session", fetcher, { refreshInterval: 600000 });
  return user;
};

export { signInStrapi, useUSer as useUser };

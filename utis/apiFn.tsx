import axios from "axios";

const signInStrapi = async (identifier: string, password: string) => {
  const res = await axios.post("http://agrappl03.aapico.com:1340/api/auth/local", {
    identifier,
    password,
  });
  return res;
};

export { signInStrapi };

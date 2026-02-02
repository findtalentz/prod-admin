import getSessionFromToken from "@/actions/get-session-from-token";
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  const session = await getSessionFromToken();
  let token = "";
  if (session && session.token) token = session.token;
  config.headers["x-auth-token"] = token;
  return config;
});

export default instance;

import { environment } from "@/environments/environment";
import axios from "axios";

export const studentLoadOneResolver = async (to, from, next) => {
  const username = to.params.username;
  to.meta["student"] = await axios.get(
    `${environment.serverUrl}/students/${username}`
  );
  next();
};

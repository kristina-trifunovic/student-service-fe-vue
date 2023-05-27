import { environment } from "@/environments/environment";
import axios from "axios";

export const professorLoadOneResolver = async (to, from, next) => {
  const username = to.params.username;
  to.meta["professor"] = await axios.get(
    `${environment.serverUrl}/professors/${username}`
  );
  next();
};

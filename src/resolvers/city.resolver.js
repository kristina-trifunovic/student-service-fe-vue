import { environment } from "@/environments/environment";
import axios from "axios";

export const cityLoadOneResolver = async (to, from, next) => {
  const id = to.params.id;
  to.meta["city"] = await axios.get(`${environment.serverUrl}/cities/${id}`);
  next();
};

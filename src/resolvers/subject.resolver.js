import { environment } from "@/environments/environment";
import axios from "axios";

export const subjectLoadOneResolver = async (to, from, next) => {
  const id = to.params.id;
  to.meta["subject"] = await axios.get(
    `${environment.serverUrl}/subjects/${id}`
  );
  next();
};

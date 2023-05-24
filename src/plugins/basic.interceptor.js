import axios from "axios";
import useUserStore from "@/stores/user";

export function basicInterceptor() {
  let userStore = useUserStore();
  axios.interceptors.request.use((request) => {
    const token = sessionStorage.getItem("token");
    if (userStore.userLoggedIn.username && token) {
      request.headers = `Authorization: ${token}`;
    }
    return request;
  });
}

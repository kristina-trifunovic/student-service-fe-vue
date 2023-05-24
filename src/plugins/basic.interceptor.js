import axios from "axios";
import useUserStore from "@/stores/user";

export function basicInterceptor() {
  let userStore = useUserStore();
  axios.interceptors.request.use((request) => {
    console.log("request", request);
    const token = sessionStorage.getItem("token");
    console.log("interceptor before if");
    if (userStore.userLoggedIn.username && token) {
      request.headers = `Authorization: ${token}`;
      console.log("interceptor in if");
    }
    console.log("interceptor after if");

    return request;
  });
}

import { defineStore } from "pinia";
import axios from "axios";

export default defineStore("user", {
  state: () => ({
    // isUserLoggedIn: false,
    // userLoggedIn: reactive({
    //   accountNonExpired: true,
    //   accountNonLocked: true,
    //   address: "",
    //   authorities: [{ authority: "" }],
    //   city: { postalCode: 0, name: "" },
    //   credentialsNonExpired: true,
    //   firstName: "",
    //   lastName: "",
    //   password: "",
    //   username: "",
    // }),
  }),
  actions: {
    login(credentials) {
      return this.authenticate(credentials);
    },
    authenticate(credentials) {
      const params = new URLSearchParams();
      params.append("username", credentials.username);
      params.append("password", credentials.password);
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      return axios.post("http://localhost:9090/auth/login", params, config);
    },
  },
  getters: {
    user: () => {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else if (sessionStorage.getItem("user")) {
        return JSON.parse(sessionStorage.getItem("user"));
      }
    },
  },
});

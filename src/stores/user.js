import { defineStore } from "pinia";
import axios from "axios";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : {
          accountNonExpired: true,
          accountNonLocked: true,
          address: "",
          authorities: [{ authority: "" }],
          city: { postalCode: 0, name: "" },
          credentialsNonExpired: true,
          firstName: "",
          lastName: "",
          password: "",
          username: "",
        },
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
    logout() {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      this.$reset();
    },
  },
});

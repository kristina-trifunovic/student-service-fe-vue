import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import { required, min, max, between } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";

export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("between", between);

    configure({
      generateMessage: localize({
        en: {
          names: {
            username: "Username",
            password: "Password",
          },
          messages: {
            required: "{field} is required.",
            between: "{field} must be between 0:{min} and 1:{max} characters",
            min: "{field} must be at least 0:{min} characters",
          },
        },
        rs: {
          names: {
            username: "Korisničko ime",
            password: "Lozinka",
          },
          messages: {
            required: "{field} je obavezno polje",
            min: "{field} mora biti najmanje 0:{min} karaktera",
            between: "{field} mora biti izmedju 0:{min} i 1:{max} karaktera",
          },
        },
        // validateOnBlur: true,
        // validateOnChange: true,
        // validateOnInput: false,
        // validateOnModelUpdate: true,
      }),
    });
  },
};

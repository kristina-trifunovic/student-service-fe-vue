import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  between,
  min_value,
  alpha,
  max_value,
} from "@vee-validate/rules";
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
    defineRule("min_value", min_value);
    defineRule("max_value", max_value);
    defineRule("alpha", alpha);

    configure({
      generateMessage: localize({
        en: {
          names: {
            username: "Username",
            password: "Password",
            postalCode: "Postal code",
            name: "Name",
            indexNumber: "Index number",
            indexYear: "Index year",
            firstName: "First name",
            lastName: "Last name",
            email: "Email",
            currentYearOfStudy: "Current year of study",
            city: "City",
          },
          messages: {
            required: "{field} is required.",
            between: "{field} must be between 0:{min} and 1:{max} characters",
            min: "{field} must be at least 0:{min} characters",
            alpha: "{field} must only be alphabetical characters",
            min_value: "{field} must be minimum value of 0:{min_value}",
            max_value: "{field} must be maximum value of 0:{max_value}",
          },
        },
        rs: {
          names: {
            username: "Korisničko ime",
            password: "Lozinka",
            postalCode: "Poštanski broj",
            name: "Naziv",
            indexNumber: "Broj indeksa",
            indexYear: "Godina indeksa",
            firstName: "Ime",
            lastName: "Prezime",
            email: "Email",
            currentYearOfStudy: "Trenutna godina studija",
            city: "Grad",
          },
          messages: {
            required: "{field} je obavezno polje",
            min: "{field} mora biti najmanje 0:{min} karaktera",
            between: "{field} mora biti izmedju 0:{min} i 1:{max} karaktera",
            alpha: "{field} mora biti sadržan samo od slova",
            min_value: "{field} mora biti minimum 0:{min_value}",
            max_value: "{field} mora biti maksimum 0:{max_value}",
          },
        },
      }),
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: true,
      validateOnModelUpdate: true,
    });
  },
};

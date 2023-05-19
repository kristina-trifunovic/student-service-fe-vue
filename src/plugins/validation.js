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
  alpha_spaces as alphaSpaces,
  email,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", (value) => {
      if (value && value.trim()) return true;
      return "This field is required";
    });
    defineRule("min", min);
    defineRule("max", max);

    configure({
      generateMessage: (context) => {
        const messages = {
          required: `The field ${context.field} is required.`,
          min: `The field ${context.field} is too short.`,
          max: `The field ${context.field} is too long.`,
        };

        const message = messages[context.rule.name]
          ? messages[context.rule.name]
          : `The field ${context.field} is invalid`;
        return message;
      },
      validateOnBlur: true, // tells vee-validate if it will validate on blur event
      validateOnChange: true, // if it should validate the field on the change event
      validateOnInput: true,
      validateOnModelUpdate: true,
    });
  },
};

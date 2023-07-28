import { createLocalVue, mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import Login from "@/views/Login.vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";

describe("Login.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const localVue = createLocalVue();
    localVue.use(PrimeVue);
    localVue.use(ToastService);
  });

  // For this test to work, the language of the app must be Serbian - rs
  it("checks text on login page", () => {
    const wrapper = mount(Login, {
      localVue,
      global: {
        mocks: {
          $t: () => "Dobrodošli",
        },
      },
    });

    expect(wrapper.text()).toMatch("Dobrodošli");
  });
});

import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import CityForm from "@/views/cities/CityForm.vue";
import useToast from "primevue/usetoast";

describe("CityForm.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // For this test to work, the language of the app must be Serbian - rs
  it(
    "checks text on city form add page",
    () => {
      const toast = useToast();
      const wrapper = mount(CityForm, {
        global: {
          provide: toast,
          mocks: {
            $t: () => "Dodaj grad",
          },
        },
      });
      expect(wrapper.text()).toMatch("Dodaj grad");
    },

    it("checks if on cancel re-routes to city list", () => {
      const wrapper = mount(CityForm, {
        global: {
          provide: toast,
          mocks: {
            $t: () => "Dodaj grad",
          },
        },
      });
    })
  );
});

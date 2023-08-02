import { createApp } from "vue";
// import PrimeVueToastMock from "./__mocks__/toast-mock";

// // Mock PrimeVue Toast
// jest.mock("primevue/toast", () => ({
//   __esModule: true,
//   default: PrimeVueToastMock,
// }));

// Set up Vue instance
const app = createApp({});
app.config.warnHandler = () => {};

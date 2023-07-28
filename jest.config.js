module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transformIgnorePatterns: ["/node_modules/(?!(axios|primevue/.*))"],
  setupFilesAfterEnv: ["./jest.setup.js"],
};

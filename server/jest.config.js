// jest.config.js
module.exports = {
  // [...]
  // Replace `ts-jest` with the preset you want to use
  // from the above list
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "node",
  setupFilesAfterEnv: ["jest-extended"]
};

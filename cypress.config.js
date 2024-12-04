const { defineConfig } = require("cypress");
const { spawn } = require("child_process");
let server;
let baseUrl;
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.browsers = [
        ...config.browsers,
        {
          name: "opera",
          family: "chromium",
          channel: "stable",
          displayName: "Opera",
          version: "115.0.5322.68", // Replace with your Opera version
          majorVersion: "115", // Replace with your Opera major version
          path: "C:\\Users\\jiayu\\AppData\\Local\\Programs\\Opera\\opera.exe", // Path to Opera executable
        },
      ];
      require('@cypress/code-coverage/task')(on, config)
      on("task", {
        startServer() {
          return new Promise((resolve, reject) => {
            // Check if the server is already running
            if (server) {
              resolve(baseUrl);
            }
            server = spawn("node", ["-r", "nyc", "index-test.js"]);
            server.stdout.on("data", (data) => {
              console.log(data.toString());
              const baseUrlPrefix = "DevOps project at: ";
              const startIndex = data.toString().indexOf(baseUrlPrefix);
              if (startIndex !== -1) {
                  baseUrl = data.toString().substring(startIndex + baseUrlPrefix.length).trim();
                  resolve(baseUrl);
              } else {
                  resolve("http://localhost:5050"); // Fallback URL
              }
          });
            server.stderr.on("data", (data) => {
              reject(data);
            });
          });
        },
        stopServer() {
          if (server) {
            server.kill();
          }
          return null;
        }
      });
      return config
    },
  }
});
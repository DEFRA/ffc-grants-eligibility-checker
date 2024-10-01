import pkg from "../../package.json" with { type: "json" };

export const app = {
  // Application data
  name: pkg.name,
  description: pkg.description,
  version: pkg.version,

  // Local Development
  host: "0.0.0.0",
  port: 3000,
};

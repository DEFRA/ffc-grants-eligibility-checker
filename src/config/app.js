import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const pkg = require(path.join(__dirname, "../../package.json"));
export const app = {
  // Application data
  name: pkg.name,
  description: pkg.description,
  version: pkg.version,

  // Local Development
  host: "0.0.0.0",
  port: 3000,
};

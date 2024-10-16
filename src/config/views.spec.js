// Import the views object
import { views } from "./views.js";

describe("Views Configuration", () => {
  describe("paths and assets", () => {
    it("should have the correct configuration", () => {
      expect(views.paths).toHaveLength(2);
      expect(views.paths).toContain("src/views");
      expect(views.paths).toContain("node_modules/govuk-frontend/dist");
      expect(views.assets).toHaveProperty("gov");
      expect(views.assets).toHaveProperty("app");
      expect(views.assets.gov).toBe("/assets");
      expect(views.assets.app).toBe("/assets");
      expect(views.assets.gov).toBe(views.assets.app);
    });
  });
});

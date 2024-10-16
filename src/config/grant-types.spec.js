// Import the functions and data we want to test
import {
  grantTypes,
  getGrantTypeById,
  isValidGrantType,
  isValidGrantPage,
} from "./grant-types.js";

describe("Grant Type Functions", () => {
  describe("getGrantTypeById", () => {
    it("should return the correct grant type object for a valid id", () => {
      const result = getGrantTypeById("example-grant");
      expect(result).toEqual(grantTypes[0]);
    });

    it("should return undefined for an invalid id", () => {
      const result = getGrantTypeById("non-existent-grant");
      expect(result).toBeUndefined();
    });
  });

  describe("isValidGrantType", () => {
    it("should return true for a valid grant type id", () => {
      const result = isValidGrantType("example-grant");
      expect(result).toBe(true);
    });

    it("should return false for an invalid grant type id", () => {
      const result = isValidGrantType("non-existent-grant");
      expect(result).toBe(false);
    });
  });

  describe("isValidGrantPage", () => {
    const exampleGrantType = grantTypes[0];

    it("should return true for a valid page id", () => {
      const result = isValidGrantPage(exampleGrantType, "start");
      expect(result).toBe(true);
    });

    it("should return false for an invalid page id", () => {
      const result = isValidGrantPage(exampleGrantType, "non-existent-page");
      expect(result).toBe(false);
    });

    it("should return false when grant type has no pages", () => {
      const emptyGrantType = { ...exampleGrantType, pages: [] };
      const result = isValidGrantPage(emptyGrantType, "start");
      expect(result).toBe(false);
    });
  });
});

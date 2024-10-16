import redirectToStartPage from "./redirect-to-start-page.js";
import { isValidGrantType } from "../config/grant-types.js";
import { getInvalidGrantTypeResponse } from "./get-invalid-response.js";

jest.mock("../config/grant-types.js", () => ({
  isValidGrantType: jest.fn(),
}));

jest.mock("./get-invalid-response.js", () => ({
  getInvalidGrantTypeResponse: jest.fn(),
}));

describe("redirectToStartPage", () => {
  it("redirects to start page with valid grant type", () => {
    process.env.URL_PREFIX = "/mock-url-prefix";
    const request = {
      url: "https://example.com/eligibility-checker/valid-grant-type",
    };
    const h = { redirect: jest.fn() };
    isValidGrantType.mockReturnValue(true);

    redirectToStartPage(request, h);
    expect(h.redirect).toHaveBeenCalledTimes(1);
    expect(h.redirect).toHaveBeenCalledWith(
      "/mock-url-prefix/valid-grant-type/start",
    );
  });

  it("returns invalid grant type response with invalid grant type", () => {
    const request = {
      url: "https://example.com/eligibility-checker/invalid-grant-type",
    };
    const h = { redirect: jest.fn() };
    isValidGrantType.mockReturnValue(false);

    const result = redirectToStartPage(request, h);
    expect(getInvalidGrantTypeResponse).toHaveBeenCalledTimes(1);
    expect(result).toBe(getInvalidGrantTypeResponse(h));
  });
});

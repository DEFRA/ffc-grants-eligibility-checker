import { getGrantTypeFromUrl, getPageFromUrl } from "./get-info-from-url";

describe("getGrantTypeFromUrl", () => {
  it("should extract grant type id from a string URL", () => {
    const url = "/eligibility-checker/example-grant/example-page";
    expect(getGrantTypeFromUrl(url)).toBe("example-grant");
  });
});

describe("getPageFromUrl", () => {
  it("should extract page id from a string URL", () => {
    const url = "/eligibility-checker/example-grant/example-page";
    expect(getPageFromUrl(url)).toBe("example-page");
  });
});

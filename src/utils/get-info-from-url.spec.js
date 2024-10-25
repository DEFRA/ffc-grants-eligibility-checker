import { getGrantTypeFromUrl, getPageFromUrl } from "./get-info-from-url";

describe("getGrantTypeFromUrl", () => {
  it("should extract grant type id from a string URL", () => {
    expect(
      getGrantTypeFromUrl(
        new URL("http://example.com/example-grant/example-page"),
      ),
    ).toBe("example-grant");
  });

  it("should extract grant type id from a string URL with eligibility-checker prefix", () => {
    expect(
      getGrantTypeFromUrl(
        new URL(
          "http://example.com/eligibility-checker/example-grant/example-page",
        ),
      ),
    ).toBe("example-grant");
  });
});

describe("getPageFromUrl", () => {
  it("should extract page id from a string URL", () => {
    expect(
      getPageFromUrl(new URL("http://example.com/example-grant/example-page")),
    ).toBe("example-page");
  });

  it("should extract page id from a string URL with eligibility-checker prefix", () => {
    expect(
      getPageFromUrl(
        new URL(
          "http://example.com/eligibility-checker/example-grant/example-page",
        ),
      ),
    ).toBe("example-page");
  });
});

import { viewGrantType } from "./grantType.js";

const mockH = jest.fn();
const grantType = "Grant1";
const requestMock = {
  url: `/eligibility-checker/${grantType}`,
};

describe("Grant Type Tests", () => {
  it("should get view with requested grant type", () => {
    viewGrantType(requestMock, {
      view: mockH,
    });

    expect(mockH).toHaveBeenCalledWith("layout.njk", {
      siteTitle: `FFC Grants Eligibility Checker - ${grantType}`,
      urlPrefix: "/eligibility-checker",
      showTimeout: true,
      surveyLink: "https://example.com/survey",
      sessionTimeoutInMin: 15,
      timeoutPath: "/timeout",
      cookiesPolicy: {
        confirmed: false,
        analytics: true,
      },
    });
  });
});

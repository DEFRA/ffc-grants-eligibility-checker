import getContext from "./get-context";

describe("getContext", () => {
  it("should return the correct context object", () => {
    process.env.SITE_TITLE = "mock-title";
    process.env.URL_PREFIX = "/mock-url-prefix";
    process.env.SURVEY_LINK = "mock-survey-link.com";
    process.env.SESSION_TIMEOUT_IN_MINS = "1";
    process.env.TIMEOUT_PATH = "mock-timeout-path";

    const mockGrantType = {
      id: "example-grant",
      name: "Example Grant",
      description: "This is an example grant",
    };

    const expectedContext = {
      siteTitle: "mock-title - example-grant",
      urlPrefix: "/mock-url-prefix",
      showTimeout: true,
      surveyLink: "mock-survey-link.com",
      sessionTimeoutInMin: "1",
      timeoutPath: "mock-timeout-path",
      cookiesPolicy: {
        confirmed: false,
        analytics: true,
      },
      grantType: mockGrantType,
    };

    const result = getContext(mockGrantType);
    expect(result).toEqual(expectedContext);
  });
});

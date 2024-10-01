import { routes, viewGrantType } from "./grantType.js";

const mockH = jest.fn();
const mockCode = jest.fn();
const mockResponse = jest.fn().mockImplementation(() => {
  return { code: mockCode };
});
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

  it("should return 200 for GET healthy handler", () => {
    mockCode.mockReturnValue(200);
    const response = routes[1].handler(requestMock, { response: mockResponse });
    expect(response).toBe(200);
  });

  it("should return 200 for GET healthz handler", () => {
    mockCode.mockReturnValue(200);
    const response = routes[2].handler(requestMock, { response: mockResponse });
    expect(response).toBe(200);
  });
});

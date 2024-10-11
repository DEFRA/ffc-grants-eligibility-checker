import { routes, viewGrantType } from "./grant-type.js";
import * as grantTypes from "../../../config/grant-types.js";
import * as getInfoFromUrl from "../../../utils/get-info-from-url.js";
import * as getInvalidResponse from "../../../utils/get-invalid-response.js";
import getContext from "./get-context.js";
import statusCodes, { OK } from "../../../constants/status-codes.js";

jest.mock("../../../config/grant-types.js");
jest.mock("../../../utils/get-info-from-url.js");
jest.mock("../../../utils/get-invalid-response.js");
jest.mock("./get-context.js");

describe("Grant Type Tests", () => {
  const mockH = {
    view: jest.fn(),
    response: jest.fn().mockReturnThis(),
    code: jest.fn(),
  };

  const grantType = {
    id: "example-grant",
  };

  const requestMock = {
    url: `/eligibility-checker/${grantType.id}/start`,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getInfoFromUrl.getPageFromUrl.mockReturnValue("start");
    grantTypes.isValidGrantType.mockReturnValue(true);
    grantTypes.getGrantTypeById.mockReturnValue(grantType);
    grantTypes.isValidGrantPage.mockReturnValue(true);
    getContext.mockReturnValue({
      siteTitle: `FFC Grants Eligibility Checker - ${grantType.id}`,
      urlPrefix: "/eligibility-checker",
      showTimeout: true,
      surveyLink: "https://example.com/survey",
      sessionTimeoutInMin: 15,
      timeoutPath: "/timeout",
      cookiesPolicy: {
        confirmed: false,
        analytics: true,
      },
      grantType,
    });
  });

  it("should get view with requested grant type and page", () => {
    viewGrantType(requestMock, mockH);

    expect(mockH.view).toHaveBeenCalledWith(
      `pages/${grantType.id}/start.njk`,
      expect.objectContaining({
        siteTitle: `FFC Grants Eligibility Checker - ${grantType.id}`,
        grantType,
      }),
    );
  });

  it("should return invalid grant type response when grant type is invalid", () => {
    grantTypes.isValidGrantType.mockReturnValue(false);
    getInvalidResponse.getInvalidGrantTypeResponse.mockReturnValue(
      "Invalid Grant Type",
    );

    const result = viewGrantType(requestMock, mockH);

    expect(result).toBe("Invalid Grant Type");
    expect(getInvalidResponse.getInvalidGrantTypeResponse).toHaveBeenCalledWith(
      mockH,
    );
  });

  it("should return invalid page response when page is invalid", () => {
    grantTypes.isValidGrantPage.mockReturnValue(false);
    getInvalidResponse.getInvalidPageResponse.mockReturnValue("Invalid Page");

    const result = viewGrantType(requestMock, mockH);

    expect(result).toBe("Invalid Page");
    expect(getInvalidResponse.getInvalidPageResponse).toHaveBeenCalledWith(
      requestMock,
      mockH,
    );
  });

  it("should return 200 for GET healthy handler", () => {
    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };

    routes[0].handler({}, mockH);

    expect(mockH.response).toHaveBeenCalledWith("ok");
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(OK));
  });

  it("should return 200 for GET healthz handler", () => {
    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };

    routes[1].handler({}, mockH);

    expect(mockH.response).toHaveBeenCalledWith("ok");
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(OK));
  });
});

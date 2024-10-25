import { isValidStateTransition, routes, viewGrantType } from "./grant-type.js";
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
    code: jest.fn()
  };

  const grantType = {
    id: 'example-grant'
  };

  const requestMock = {
    url: `/${grantType.id}/start`,
    params: {
      grantType: grantType.id,
      page: 'start'
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockIsValidGrantType.mockReturnValue(true);
    mockGetGrantTypeById.mockReturnValue(grantType);
    mockIsValidGrantPage.mockReturnValue(true);
  });

  it('should get view with requested grant type and page', () => {
    viewGrantType(requestMock, mockH);

    expect(mockH.view).toHaveBeenCalledWith(
      `pages/${grantType.id}/start.njk`,
      expect.objectContaining({
        siteTitle: 'FFC Grants Eligibility Checker - example-grant'
      })
    );
  });

  it('should return invalid grant type response when grant type is invalid', () => {
    mockIsValidGrantType.mockReturnValue(false);
    mockGetInvalidGrantTypeResponse.mockReturnValue('Invalid Grant Type');

    const result = viewGrantType(requestMock, mockH);

    expect(result).toBe('Invalid Grant Type');
    expect(mockGetInvalidGrantTypeResponse).toHaveBeenCalledWith(mockH);
  });

  it('should return invalid page response when page is invalid', () => {
    mockIsValidGrantPage.mockReturnValue(false);
    mockGetInvalidPageResponse.mockReturnValue('Invalid Page');

    const result = viewGrantType(requestMock, mockH);

    expect(result).toBe('Invalid Page');
    expect(mockGetInvalidPageResponse).toHaveBeenCalledWith(mockH);
  });

  it('should return 200 for GET healthy handler', () => {
    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    routes[0].handler({}, mockH);

    expect(mockH.response).toHaveBeenCalledWith('ok');
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(OK));
  });

  it('should return 200 for GET healthz handler', () => {
    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    routes[1].handler({}, mockH);

    expect(mockH.response).toHaveBeenCalledWith('ok');
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(OK));
  });

  describe("isValidGrantPage", () => {
    const exampleGrantType = grantTypes[0];

    it("should return true for a valid page id", () => {
      const result = isValidStateTransition(exampleGrantType, "start");
      expect(result).toBe(true);
    });

    it("should return false for an invalid page id", () => {
      const result = isValidStateTransition(
        exampleGrantType,
        "non-existent-page",
      );
      expect(result).toBe(false);
    });

    it("should return false when grant type has no pages", () => {
      const emptyGrantType = { ...exampleGrantType, pages: [] };
      const result = isValidStateTransition(emptyGrantType, "start");
      expect(result).toBe(false);
    });
  });
});

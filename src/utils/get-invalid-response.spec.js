import {
  getInvalidGrantTypeResponse,
  getInvalidPageResponse,
} from "./get-invalid-response.js";
import statusCodes, { NOT_FOUND } from "../constants/status-codes.js";

describe("getInvalidPageResponse", () => {
  let mockH;
  let mockRequest;

  beforeEach(() => {
    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
    mockRequest = {}; // Empty object as request isn't used in the function
  });

  it("should return a 404 response from getInvalidGrantTypeResponse with the correct message", () => {
    const result = getInvalidGrantTypeResponse(mockH);
    expect(mockH.response).toHaveBeenCalledWith("Grant type not found");
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(NOT_FOUND));
    expect(result).toBe(mockH);
  });

  it("should return a 404 response from getInvalidPageResponse with the correct message", () => {
    const result = getInvalidPageResponse(mockRequest, mockH);
    expect(mockH.response).toHaveBeenCalledWith("Page not found");
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(NOT_FOUND));
    expect(result).toBe(mockH);
  });
});

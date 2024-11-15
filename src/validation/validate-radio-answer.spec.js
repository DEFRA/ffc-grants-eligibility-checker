import { jest } from '@jest/globals';
import { validateRadioAnswer } from './validate-radio-answer';
import statusCodes, { OK } from '../constants/status-codes.js';

describe('validateRadioAnswer', () => {
  let mockGrantTypeMachineService;
  let mockRequest;
  let mockH;

  beforeEach(() => {
    mockGrantTypeMachineService = {
      send: jest.fn()
    };

    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };
  });

  it('should return null when answer is provided', () => {
    mockRequest = {
      payload: {
        currentPageId: 'testPage',
        answer: 'yes'
      }
    };

    const result = validateRadioAnswer(mockGrantTypeMachineService, mockRequest, mockH);

    expect(result).toBeNull();
    expect(mockGrantTypeMachineService.send).not.toHaveBeenCalled();
    expect(mockH.response).not.toHaveBeenCalled();
  });

  it('should handle missing answer and return error response', () => {
    const currentPageId = 'testPage';
    mockRequest = {
      payload: {
        currentPageId,
        answer: ''
      }
    };

    validateRadioAnswer(mockGrantTypeMachineService, mockRequest, mockH);

    // Verify machine service was called with correct error parameters
    expect(mockGrantTypeMachineService.send).toHaveBeenCalledWith({
      type: 'UPDATE_STATE',
      currentPageId,
      errors: {
        [currentPageId]: {
          key: `${currentPageId}Required`,
          message: 'Select an option'
        }
      }
    });

    // Verify response was constructed correctly
    expect(mockH.response).toHaveBeenCalledWith({
      status: 'error',
      currentPageId
    });
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(OK));
  });

  it('should handle null answer value', () => {
    const currentPageId = 'testPage';
    mockRequest = {
      payload: {
        currentPageId,
        answer: null
      }
    };

    validateRadioAnswer(mockGrantTypeMachineService, mockRequest, mockH);

    expect(mockGrantTypeMachineService.send).toHaveBeenCalled();
    expect(mockH.response).toHaveBeenCalled();
  });

  it('should handle undefined answer value', () => {
    const currentPageId = 'testPage';
    mockRequest = {
      payload: {
        currentPageId,
        answer: undefined
      }
    };

    validateRadioAnswer(mockGrantTypeMachineService, mockRequest, mockH);

    expect(mockGrantTypeMachineService.send).toHaveBeenCalled();
    expect(mockH.response).toHaveBeenCalled();
  });

  it('should use correct status code when error occurs', () => {
    mockRequest = {
      payload: {
        currentPageId: 'testPage',
        answer: ''
      }
    };

    validateRadioAnswer(mockGrantTypeMachineService, mockRequest, mockH);

    expect(mockH.code).toHaveBeenCalledWith(statusCodes(OK));
  });
});

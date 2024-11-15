import { jest } from '@jest/globals';
import statusCodes, { OK } from '../constants/status-codes.js';
import { checkPageForError } from './check-page-for-error.js';

describe('checkPageForError', () => {
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

  it('should return null when answer is provided for radio question', () => {
    mockRequest = {
      payload: {
        currentPageId: 'testPage',
        questionType: 'radio',
        answer: 'Yes'
      }
    };

    const result = checkPageForError(mockGrantTypeMachineService, mockRequest, mockH);

    expect(result).toBeNull();
    expect(mockGrantTypeMachineService.send).not.toHaveBeenCalled();
    expect(mockH.response).not.toHaveBeenCalled();
    expect(mockH.code).not.toHaveBeenCalled();
  });

  it('should return null when question type is not radio', () => {
    mockRequest = {
      payload: {
        currentPageId: 'testPage',
        questionType: 'text',
        answer: ''
      }
    };

    const result = checkPageForError(mockGrantTypeMachineService, mockRequest, mockH);

    expect(result).toBeNull();
    expect(mockGrantTypeMachineService.send).not.toHaveBeenCalled();
    expect(mockH.response).not.toHaveBeenCalled();
    expect(mockH.code).not.toHaveBeenCalled();
  });

  it('should handle null answer for radio question', () => {
    mockRequest = {
      payload: {
        currentPageId: 'testPage',
        questionType: 'radio',
        answer: null
      }
    };

    const result = checkPageForError(mockGrantTypeMachineService, mockRequest, mockH);

    expect(mockGrantTypeMachineService.send).toHaveBeenCalledWith({
      type: 'UPDATE_STATE',
      currentPageId: 'testPage',
      errors: {
        testPage: {
          key: 'testPageRequired',
          message: 'Select an option'
        }
      }
    });
    expect(mockH.response).toHaveBeenCalled();
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(OK));
    expect(result).toBeDefined();
  });
});

import { addGrantType, getGrantType } from './grantType.js'

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'dummy-id-for-testing')
  }
})

describe('Grant Type Tests', () => {
  it('should add and get grant type', () => {
    const title = 'Test Title'
    const description = 'Test Description'

    const expectedGrantType = {
      id: 'dummy-id-for-testing',
      title,
      description
    }

    addGrantType(title, description)
    const actualGrantType = getGrantType()

    expect(actualGrantType).toEqual(expectedGrantType)
  })
})

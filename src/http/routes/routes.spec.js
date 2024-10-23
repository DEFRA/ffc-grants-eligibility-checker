import { describe, expect } from '@jest/globals';
import { routes } from './grant-type/grant-type.js';
import { getRouteDefinitions } from './routes.js';

describe('routes', () => {
  const expectedRoutes = [
    {
      method: 'GET',
      path: '/healthy'
    },
    {
      method: 'GET',
      path: '/healthz'
    },
    {
      method: 'GET',
      path: '/{grantType}'
    },
    {
      method: 'GET',
      path: '/{grantType}/{page*}'
    }
  ];

  const matchRouteWithoutHandler = expect.objectContaining({
    method: expect.any(String),
    path: expect.any(String)
  });

  it('should define the correct routes', () => {
    expect(routes).toEqual(
      expect.arrayContaining(expectedRoutes.map((route) => matchRouteWithoutHandler))
    );

    expect(routes.length).toBe(expectedRoutes.length);
  });

  it('should call getRouteDefinitions', () => {
    expect(getRouteDefinitions()).toEqual(
      expect.arrayContaining(expectedRoutes.map((route) => matchRouteWithoutHandler))
    );
  });
});

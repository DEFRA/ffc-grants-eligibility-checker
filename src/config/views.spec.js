// Import the viewsConfig object
import { viewsConfig } from './views.js';

describe('viewsConfig Configuration', () => {
  describe('paths and assets', () => {
    it('should have the correct configuration', () => {
      expect(viewsConfig.paths).toHaveLength(2);
      expect(viewsConfig.paths).toContain('src/views');
      expect(viewsConfig.paths).toContain('node_modules/govuk-frontend/dist');
      expect(viewsConfig.assets).toHaveProperty('gov');
      expect(viewsConfig.assets).toHaveProperty('app');
      expect(viewsConfig.assets.gov).toBe('/assets');
      expect(viewsConfig.assets.app).toBe('/assets');
      expect(viewsConfig.assets.gov).toBe(viewsConfig.assets.app);
    });
  });
});

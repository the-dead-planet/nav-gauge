import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:6006',
        specPattern: 'cypress/e2e/**/*.cy.ts',
        supportFile: false,
    },
});

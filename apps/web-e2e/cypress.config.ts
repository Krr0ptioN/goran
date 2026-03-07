import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        ...nxE2EPreset(__filename, {
            cypressDir: 'src',
            webServerCommands: { default: 'nx run web:start -- --port=4400' },
            ciWebServerCommand: 'nx run web:serve-static -- --port=4400',
        }),
        baseUrl: 'http://localhost:4400',
    },
});

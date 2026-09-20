import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on) {
            on('before:browser:launch', (browser, launchOptions) => {
                if (browser.family === 'chromium') {
                    launchOptions.args.push(
                        '--enable-webgl',
                        '--use-gl=angle',
                        '--use-angle=swiftshader',
                        '--enable-unsafe-swiftshader',
                    );
                }

                return launchOptions;
            });
        },
    },
});

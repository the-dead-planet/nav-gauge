const path = require('path');

module.exports = {
    spec: ['test/**/*.test.ts'],
    $schema: 'https://json.schemastore.org/mocharc.json',
    require: [
        path.resolve(__dirname, 'scripts/app/stub-svg.cjs'),
        'tsx',
    ],
};

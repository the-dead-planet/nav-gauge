const fs = require('fs');
const path = require('path');

const gearsRoot = path.resolve(__dirname, '..', 'gears');
const gearsPublicAssets = fs
    .readdirSync(gearsRoot, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .filter((dir) => fs.existsSync(path.join(gearsRoot, dir.name, 'common', 'public')))
    .map((dir) => `../gears/${dir.name}/common/public`);

module.exports = {
    project: {
        ios: {},
        android: {},
    },
    assets: [
        '../apparatus/common/public/tiles',
        '../ui/common/public/fonts',
        ...gearsPublicAssets,
    ],
};

const fs = require('fs');
const Module = require('module');

Module._extensions['.svg'] = function (module, filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const source = [
        'Object.defineProperty(exports, "__esModule", { value: true });',
        'exports.default = ' + JSON.stringify(content) + ';',
    ].join('\n');
    module._compile(source, filename);
};

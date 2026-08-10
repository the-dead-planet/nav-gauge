module.exports = function (api) {
    return {
        presets: [
            ['@babel/preset-env', {
                targets: { node: 'current' },
            }],
            ['@babel/preset-react', {
                runtime: 'automatic',
                development: !api.env('production'),
            }],
            '@babel/preset-typescript',
        ],
        plugins: [
            ['babel-plugin-react-compiler', {}],
        ],
    };
};

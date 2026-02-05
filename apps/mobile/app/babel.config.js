module.exports = {
    presets: [
        'module:@react-native/babel-preset'
    ],
    plugins: [
        'babel-plugin-react-compiler',
        [
            'module-resolver',
            {
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
                alias: {
                    '@apparatus': '../../packages/apparatus/src',
                    '@tinker-chest': '../../packages/tinker-chest/src',
                    '@ui': '../../ui/src',
                    '@mobile-ui': '../ui/src',
                    '@the-dead-planet/nav-gauge-gears-(.+)$': '../../gears/\\1/src',
                    '@the-dead-planet/nav-gauge-mobile-gears-(.+)$': '../gears/\\1/src'
                },
            },
        ]
    ],
};

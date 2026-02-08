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
                    '@apparatus': '../packages/apparatus/src',
                    '@tinker-chest': '../packages/tinker-chest/src',
                    '@ui': '../ui/common/src',
                    '@mobile-ui': '../ui/mobile/src',
                    '@the-dead-planet/nav-gauge-gears-(.+)$-common': '../gears/\\1/common/src',
                    '@the-dead-planet/nav-gauge-gears-(.+)$-mobile': '../gears/\\1/mobile/src'
                },
            },
        ]
    ],
};

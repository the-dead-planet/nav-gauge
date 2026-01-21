module.exports = {
  presets: [
    'module:@react-native/babel-preset'
  ],
  plugins: [
    'babel-plugin-react-compiler',
    // [
    //   'module-resolver',
    //   {
    //     extensions: ['.ts', '.tsx', '.js', '.jsx'],
    //     alias: {
    //       '@apparatus': '../../packages/apparatus',
    //       '@tinker-chest': '../../packages/tinker-chest',
    //       '@ui': '../../ui',
    //     },
    //   },
    // ]
  ],
};

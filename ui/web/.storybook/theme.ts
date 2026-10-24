import { create } from 'storybook/theming';
import {
    type ColorShade,
    FontType,
    fontTypeToFamily,
    ThemeName,
    themeSpecifications,
} from '@the-dead-planet/nav-gauge-ui-common';

const colors = themeSpecifications[ThemeName.Default].dark.colors;

const color = (shade: ColorShade, palette = colors.neutral): string => {
    const { r, g, b } = palette[shade];
    return `rgb(${r}, ${g}, ${b})`;
};

export const storybookTheme = create({
    base: 'dark',
    fontBase: `"${fontTypeToFamily[FontType.Default]}", sans-serif`,
    fontCode: `"${fontTypeToFamily[FontType.Numeric]}", monospace`,
    colorPrimary: color(300, colors.primary),
    colorSecondary: color(600, colors.primary),
    appBg: color(900),
    appContentBg: color(900),
    appPreviewBg: color(900),
    appHoverBg: color(800),
    appBorderColor: color(700),
    appBorderRadius: 0,
    textColor: color(100),
    textInverseColor: color(900),
    textMutedColor: color(300),
    barTextColor: color(200),
    barHoverColor: color(300, colors.primary),
    barSelectedColor: color(300, colors.primary),
    barBg: color(900),
    buttonBg: color(800),
    buttonBorder: color(700),
    inputBg: color(900),
    inputBorder: color(700),
    inputTextColor: color(100),
    inputBorderRadius: 0,
});

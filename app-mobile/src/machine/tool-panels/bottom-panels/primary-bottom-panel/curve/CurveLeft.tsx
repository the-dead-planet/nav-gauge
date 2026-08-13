import { FC } from "react";
import { Svg, Path } from "react-native-svg";
import { useTheme } from "@ui";
import { CURVE_SIZE } from "@apparatus";

export const CurveLeft: FC = () => {
    const theme = useTheme();

    return (
        <Svg width={CURVE_SIZE} height={CURVE_SIZE} viewBox="0 0 100 100">
            <Path
                d="M0,98 C60,100 40,0 105,5 L105,100 L0,100 Z"
                fill={theme.componentColor('background', 0.87)}
            />
            <Path
                d="M0,96 C60,100 40,0 100,4"
                fill="none"
                stroke={theme.color('primary')}
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

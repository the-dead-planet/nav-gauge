import { FC } from "react";
import { Svg, Path } from "react-native-svg";
import { CURVE_SIZE } from "@apparatus";
import { useTheme } from "@ui";

export const CurveRight: FC = () => {
    const theme = useTheme();

    return (
        <Svg width={CURVE_SIZE} height={CURVE_SIZE} viewBox="0 0 100 100">
            <Path
                d="M100,98 C40,100 60,0 0,5 L0,100 L100,100 Z"
                fill={theme.componentColor('background', 0.87)}
            />
            <Path
                d="M100,96 C40,100 60,0 0,4"
                fill="none"
                stroke={theme.color('primary')}
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

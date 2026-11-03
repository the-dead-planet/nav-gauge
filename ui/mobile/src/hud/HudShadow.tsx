import { FC, useId } from "react";
import Svg, {
    Defs,
    FeComposite,
    FeFlood,
    FeGaussianBlur,
    FeOffset,
    Filter,
    Polygon,
} from "react-native-svg";
import { ResolvedThemeElevation } from "@ui";

export const HudShadow: FC<{
    width: number;
    height: number;
    points: string;
    elevation: ResolvedThemeElevation;
}> = ({ width, height, points, elevation }) => {
    const filterId = useId();
    if (elevation.opacity === 0) {
        return null;
    }
    const paddingX = Math.ceil(
        elevation.blur * 1.5 + Math.abs(elevation.offset.x),
    );
    const paddingY = Math.ceil(
        elevation.blur * 1.5 + Math.abs(elevation.offset.y),
    );
    const shadowWidth = width + paddingX * 2;
    const shadowHeight = height + paddingY * 2;

    return (
        <Svg
            width={shadowWidth}
            height={shadowHeight}
            viewBox={`${-paddingX} ${-paddingY} ${shadowWidth} ${shadowHeight}`}
            style={{ position: "absolute", left: -paddingX, top: -paddingY }}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
        >
            <Defs>
                <Filter
                    id={filterId}
                    x={-paddingX}
                    y={-paddingY}
                    width={shadowWidth}
                    height={shadowHeight}
                    filterUnits="userSpaceOnUse"
                >
                    <FeGaussianBlur
                        in="SourceAlpha"
                        stdDeviation={elevation.blur / 2}
                        result="blur"
                    />
                    <FeOffset
                        in="blur"
                        dx={elevation.offset.x}
                        dy={elevation.offset.y}
                        result="offset"
                    />
                    <FeComposite
                        in="offset"
                        in2="SourceAlpha"
                        operator="out"
                        result="outside"
                    />
                    <FeFlood
                        floodColor={elevation.color}
                        floodOpacity={elevation.opacity}
                        result="paint"
                    />
                    <FeComposite in="paint" in2="outside" operator="in" />
                </Filter>
            </Defs>
            <Polygon
                points={points}
                fill="black"
                filter={`url(#${filterId})`}
            />
        </Svg>
    );
};

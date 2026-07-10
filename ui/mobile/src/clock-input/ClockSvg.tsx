import { FC, ReactNode, useCallback, useMemo, useRef, useState } from "react";
import {
    LayoutChangeEvent,
    PanResponder,
    View,
} from "react-native";
import Svg, { G } from "react-native-svg";
import { snapSlice, svgAtan2ToClockAngle } from "@ui";
import { ClockDial } from "./ClockDial";
import { ClockTicks } from "./ClockTicks";
import { ClockPointer } from "./ClockPointer";
import { ClockThumb } from "./ClockThumb";

interface Props {
    svgSize: number;
    size: string;
    children: ReactNode;
    center: number;
    outerRadius: number;
    strokeWidth: number;
    pointerX: number;
    pointerY: number;
    centerDotRadius: number;
    thumbRadius: number;
    min: number;
    max: number;
    dialColor: string;
    isFullCircle?: boolean;
    tickColor: string;
    tickMajorColor: string;
    tickMinorOpacity: number;
    pointerColor: string;
    pointerActiveColor: string;
    centerDotFill: string;
    thumbFill: string;
    thumbStroke: string;
    thumbFillActive: string;
    thumbStrokeActive: string;
    disabled: boolean;
    onChange?: (value: number) => void;
    step: number;
    value: number;
}

export const ClockSvg: FC<Props> = ({
    svgSize,
    size,
    children,
    center,
    outerRadius,
    strokeWidth,
    pointerX,
    pointerY,
    centerDotRadius,
    thumbRadius,
    min,
    max,
    dialColor,
    isFullCircle,
    tickColor,
    tickMajorColor,
    tickMinorOpacity,
    pointerColor,
    pointerActiveColor,
    centerDotFill,
    thumbFill,
    thumbStroke,
    thumbFillActive,
    thumbStrokeActive,
    disabled,
    onChange,
    step,
    value,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const svgPageCenterRef = useRef({ x: 0, y: 0 });
    const svgRef = useRef<View>(null);

    const valueRef = useRef(value);
    valueRef.current = value;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;

    const handleLayout = useCallback((_e: LayoutChangeEvent) => {
        svgRef.current?.measureInWindow((x, y, width, height) => {
            svgPageCenterRef.current = {
                x: x + width / 2,
                y: y + height / 2,
            };
        });
    }, []);

    const handleInteraction = useCallback((pageX: number, pageY: number) => {
        if (disabledRef.current) {
            return;
        }
        const { x: cx, y: cy } = svgPageCenterRef.current;
        const dx = pageX - cx;
        const dy = pageY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4) {
            return;
        }
        const clockAngle = svgAtan2ToClockAngle(dx, dy);
        const snapped = snapSlice(clockAngle, min, max, step);
        if (snapped !== valueRef.current) {
            valueRef.current = snapped;
            onChangeRef.current?.(snapped);
        }
    }, [min, max, step]);

    const contextRef = useRef({ handleInteraction });
    contextRef.current = { handleInteraction };

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => !disabledRef.current,
        onMoveShouldSetPanResponder: () => !disabledRef.current,
        onPanResponderGrant: (evt) => {
            if (disabledRef.current) {
                return;
            }
            setIsDragging(true);
            contextRef.current.handleInteraction(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        },
        onPanResponderMove: (evt) => {
            if (disabledRef.current) {
                return;
            }
            contextRef.current.handleInteraction(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        },
        onPanResponderRelease: () => {
            setIsDragging(false);
        },
        onPanResponderTerminate: () => {
            setIsDragging(false);
        },
    }), []);

    return (
        <View
            ref={svgRef}
            onLayout={handleLayout}
            collapsable={false}
            {...panResponder.panHandlers}
        >
            <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                <G>
                    {children}
                    <ClockDial
                        center={center}
                        outerRadius={outerRadius}
                        strokeWidth={strokeWidth}
                        min={min}
                        max={max}
                        dialColor={dialColor}
                        isFullCircle={isFullCircle}
                    />
                    <ClockTicks
                        center={center}
                        outerRadius={outerRadius}
                        size={size}
                        strokeWidth={strokeWidth}
                        min={min}
                        max={max}
                        tickColor={tickColor}
                        tickMajorColor={tickMajorColor}
                        tickMinorOpacity={tickMinorOpacity}
                    />
                    <ClockPointer
                        center={center}
                        pointerX={pointerX}
                        pointerY={pointerY}
                        strokeWidth={strokeWidth}
                        isDragging={isDragging}
                        centerDotRadius={centerDotRadius}
                        pointerColor={pointerColor}
                        pointerActiveColor={pointerActiveColor}
                        centerDotFill={centerDotFill}
                    />
                    <ClockThumb
                        center={center}
                        pointerX={pointerX}
                        pointerY={pointerY}
                        thumbRadius={thumbRadius}
                        isDragging={isDragging}
                        strokeWidth={strokeWidth}
                        thumbFill={thumbFill}
                        thumbStroke={thumbStroke}
                        thumbFillActive={thumbFillActive}
                        thumbStrokeActive={thumbStrokeActive}
                    />
                </G>
            </Svg>
        </View>
    );
};

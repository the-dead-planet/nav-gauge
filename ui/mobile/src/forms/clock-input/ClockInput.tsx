import { forwardRef } from "react";
import { ViewStyle, type ViewInstance } from "react-native";
import { ClockInputProps } from "@ui";
import { ClockControl } from "./ClockControl";

export const ClockInput = forwardRef<
    ViewInstance,
    ClockInputProps & { style?: ViewStyle }
>((props, ref) => <ClockControl {...props} ref={ref} mode="angle" />);
ClockInput.displayName = "ClockInput";

import { FC } from "react";
import { ViewStyle } from "react-native";
import { ClockDurationInputProps } from "@ui";
import { ClockControl } from "./ClockControl";

export const ClockDurationInput: FC<
    ClockDurationInputProps & { style?: ViewStyle }
> = (props) => <ClockControl step={1000} {...props} mode="duration" />;

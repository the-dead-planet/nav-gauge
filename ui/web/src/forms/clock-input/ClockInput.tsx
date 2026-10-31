import { ComponentProps, FC } from "react";
import { ClockInputProps } from "@ui";
import { ClockControl } from "./ClockControl";

export const ClockInput: FC<
    ClockInputProps & Omit<ComponentProps<"div">, "onChange" | "value">
> = (props) => <ClockControl {...props} mode="angle" />;

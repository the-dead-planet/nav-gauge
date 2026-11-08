import { FC } from "react";
import { Text, TextProps } from "./Text";

export const Caption: FC<Omit<TextProps, "usage">> = (props) => (
    <Text {...props} usage="caption" />
);

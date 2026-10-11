import { FC } from "react";
import { Text, TextProps } from "./Text";

export const Label: FC<TextProps> = (props) => <Text variant="caption" {...props} />;

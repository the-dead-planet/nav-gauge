import { ComponentProps } from "react";
import { ReactSVG } from "react-svg";

export type IconProps = Omit<ComponentProps<typeof ReactSVG>, 'src'>

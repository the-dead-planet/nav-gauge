import { ComponentProps } from "react";
import { ReactSVG } from "react-svg";
import { IconAppearanceProps } from '@ui';

export type IconProps = Omit<ComponentProps<typeof ReactSVG>, 'src' | keyof IconAppearanceProps> & IconAppearanceProps;

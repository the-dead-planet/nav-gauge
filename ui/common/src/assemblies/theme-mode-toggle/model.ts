import { ButtonProps } from "../../gizmos";

export interface ThemeModeToggleProps {
    lightModeTooltip: string;
    darkModeTooltip: string;
    size?: ButtonProps['size'];
    onToggle: () => void;
}

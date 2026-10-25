import { FC } from 'react';
import { Icons, ThemeModeToggleProps, useTheme } from '@ui';
import { Button } from '../../gizmos/button';

export const ThemeModeToggle: FC<ThemeModeToggleProps> = ({
    lightModeTooltip,
    darkModeTooltip,
    size,
    onToggle,
}) => {
    const theme = useTheme();
    const isDark = theme.mode === 'dark';
    const tooltip = isDark ? lightModeTooltip : darkModeTooltip;

    return (
        <Button
            aria-label={tooltip}
            tooltip={tooltip}
            tooltipPlacement="bottom"
            icon={Icons.NounProject.LightBulbCogWheel}
            onClick={onToggle}
            variant="inset"
            size={size}
            highlightColor="secondary"
        />
    );
};

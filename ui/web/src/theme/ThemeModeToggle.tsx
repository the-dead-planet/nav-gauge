import { FC } from 'react';
import { Icons, ThemeModeToggleProps, useTheme } from '@ui';
import { Button } from '../button';

export const ThemeModeToggle: FC<ThemeModeToggleProps> = ({
    lightModeTooltip,
    darkModeTooltip,
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
            size="md"
            color={isDark ? 'secondary' : 'neutral'}
        />
    );
};

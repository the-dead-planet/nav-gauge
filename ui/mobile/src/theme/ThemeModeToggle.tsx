import { FC } from 'react';
import { Icons, ThemeModeToggleProps } from '@ui';
import { Button } from '../button';

export const ThemeModeToggle: FC<ThemeModeToggleProps> = ({
    mode,
    lightModeTooltip,
    darkModeTooltip,
    onToggle,
}) => {
    const isDark = mode === 'dark';
    const tooltip = isDark ? lightModeTooltip : darkModeTooltip;

    return (
        <Button
            aria-label={tooltip}
            tooltip={tooltip}
            tooltipPlacement="bottom"
            icon={Icons.NounProject.LightBulbCogWheel}
            onPress={onToggle}
            variant="inset"
            size="md"
            color={isDark ? 'secondary' : 'neutral'}
            highlightColor={isDark ? 'neutral' : 'secondary'}
            themeMode={mode}
        />
    );
};

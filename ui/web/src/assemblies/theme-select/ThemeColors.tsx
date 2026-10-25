import { FC, Fragment } from 'react';
import { ThemeSelectColorPreview } from '@ui';
import { ColorBox } from '../../gizmos/color-box';
import { Divider } from '../../chassis/divider';

interface Props {
    groups: ThemeSelectColorPreview[][];
    size?: number;
    className: string;
}

export const ThemeColors: FC<Props> = ({ groups, size, className }) => (
    <span className={className} aria-hidden="true">
        {groups.map((group, index) => (
            <Fragment key={index}>
                {index > 0 ? <Divider orientation="vertical" /> : null}
                {group.map(({ role, name, color, shade }) => (
                    <ColorBox
                        key={role}
                        name={name}
                        color={color}
                        shade={shade}
                        size={size}
                        showPaletteOnHover
                    />
                ))}
            </Fragment>
        ))}
    </span>
);

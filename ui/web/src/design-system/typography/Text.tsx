import { ComponentProps, FC } from "react";
import { TextUsage, TypographyProps } from "@ui";
import classNames from 'classnames';
import { TypographyElement } from './TypographyElement';
import styles from './typography.module.css';

export type { TextUsage } from '@ui';

const usageDefaultElement: Record<TextUsage, 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
    header: 'h2',
    body: 'p',
    caption: 'span',
};

export interface TextProps extends TypographyProps {
    usage?: TextUsage;
    as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Text: FC<ComponentProps<'p'> & TextProps> = ({
    usage = 'body',
    as,
    className,
    children,
    ...props
}) => {
    const tag = as ?? usageDefaultElement[usage];

    return (
        <TypographyElement
            {...props}
            as={tag}
            baseClassName={classNames(styles[tag], styles[`usage-${usage}`])}
            className={className}
        >
            {children}
        </TypographyElement>
    );
};

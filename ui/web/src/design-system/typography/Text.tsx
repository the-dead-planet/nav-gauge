import { ComponentProps, FC } from "react";
import { TextVariant, TypographyProps } from "@ui";
import classNames from 'classnames';
import { TypographyElement } from './TypographyElement';
import styles from './typography.module.css';

export type { TextVariant } from '@ui';

const variantDefaultElement: Record<TextVariant, 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
    header: 'h2',
    body: 'p',
    caption: 'span',
};

export interface TextProps extends TypographyProps {
    variant?: TextVariant;
    as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Text: FC<ComponentProps<'p'> & TextProps> = ({
    variant = 'body',
    as,
    className,
    children,
    ...props
}) => {
    const tag = as ?? variantDefaultElement[variant];

    return (
        <TypographyElement
            {...props}
            as={tag}
            baseClassName={classNames(styles[tag], styles[`variant-${variant}`])}
            className={className}
        >
            {children}
        </TypographyElement>
    );
};

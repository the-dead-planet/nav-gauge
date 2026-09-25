import { ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import { TextVariant, typographyVariantSpecifications, TypographyProps } from "@ui";
import { H1 } from './H1';
import { H2 } from './H2';
import { H3 } from './H3';
import { H4 } from './H4';
import { H5 } from './H5';
import { H6 } from './H6';
import { P } from './P';
import { Span } from './Span';
import styles from './typography.module.css';

export type { TextVariant } from '@ui';

const variantDefaultElement: Record<TextVariant, 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
    header: 'h2',
    body: 'p',
    caption: 'span',
};

const elementMap = {
    p: P,
    span: Span,
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
} as const;

export interface TextProps extends TypographyProps {
    variant?: TextVariant;
    as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

type TextStyle = CSSProperties & {
    '--typography-font-size': string;
    '--typography-font-weight': string;
    '--typography-line-height': string;
};

export const Text: FC<ComponentProps<'p'> & TextProps> = ({
    variant = 'body',
    as,
    className,
    children,
    style,
    ...props
}) => {
    const tag = as ?? variantDefaultElement[variant];
    const Component = elementMap[tag];
    const specification = typographyVariantSpecifications[variant];

    return (
        <Component
            {...props}
            className={classNames(styles[`variant-${variant}`], className)}
            style={{
                '--typography-font-size': `${specification.fontSize}px`,
                '--typography-font-weight': specification.fontWeight,
                '--typography-line-height': `${specification.lineHeight}px`,
                ...style,
            } as TextStyle}
        >
            {children}
        </Component>
    );
};

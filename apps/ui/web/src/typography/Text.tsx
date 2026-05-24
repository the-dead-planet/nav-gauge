import { ComponentProps, FC } from "react";
import { defaultTypographyProps, TypographyProps } from "@ui";
import { P, Span, H1, H2, H3, H4, H5, H6 } from './';

export type TextVariant = 'header' | 'body' | 'caption';

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

export const Text: FC<ComponentProps<'p'> & TextProps> = ({
    variant = 'body',
    as,
    children,
    ...props
}) => {
    const tag = as ?? variantDefaultElement[variant];
    const Component = elementMap[tag];

    return (
        <Component {...props}>
            {children}
        </Component>
    );
};

import { ComponentProps, FC } from "react";
import { TypographyProps } from "@ui";
import { TypographyElement } from "./TypographyElement";
import styles from './typography.module.css';

export interface LinkTextProps extends Omit<ComponentProps<'a'>, keyof TypographyProps>, TypographyProps {
    href: string;
}

export const LinkText: FC<LinkTextProps> = ({
    href,
    disabled,
    target = '_blank',
    rel = 'noopener noreferrer',
    ...props
}) => (
    <TypographyElement
        as="a"
        baseClassName={styles.link}
        {...props}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : props.tabIndex}
        target={target}
        rel={rel}
        disabled={disabled}
    />
);

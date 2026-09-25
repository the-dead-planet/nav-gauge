import { ComponentProps, FC } from "react";
import { TypographyProps } from "@ui";
import { TypographyElement } from "./TypographyElement";
import styles from './typography.module.css';

export const H4: FC<ComponentProps<'h4'> & TypographyProps> = (props) => (
    <TypographyElement as="h4" baseClassName={styles.h4} {...props} />
);

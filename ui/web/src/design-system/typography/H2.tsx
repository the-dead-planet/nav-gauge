import { ComponentProps, FC } from "react";
import { TypographyProps } from "@ui";
import { TypographyElement } from "./TypographyElement";
import styles from './typography.module.css';

export const H2: FC<ComponentProps<'h2'> & TypographyProps> = (props) => (
    <TypographyElement as="h2" baseClassName={styles.h2} {...props} />
);

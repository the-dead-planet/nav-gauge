import { ComponentProps, FC } from "react";
import { TypographyProps } from "@ui";
import { TypographyElement } from "./TypographyElement";
import styles from './typography.module.css';

export const H6: FC<ComponentProps<'h6'> & TypographyProps> = (props) => (
    <TypographyElement as="h6" baseClassName={styles.h6} {...props} />
);

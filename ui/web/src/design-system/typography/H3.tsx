import { ComponentProps, FC } from "react";
import { TypographyProps } from "@ui";
import { TypographyElement } from "./TypographyElement";
import styles from './typography.module.css';

export const H3: FC<ComponentProps<'h3'> & TypographyProps> = (props) => (
    <TypographyElement as="h3" baseClassName={styles.h3} {...props} />
);

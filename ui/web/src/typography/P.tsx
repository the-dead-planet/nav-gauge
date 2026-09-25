import { ComponentProps, FC } from "react";
import { TypographyProps } from "@ui";
import { TypographyElement } from "./TypographyElement";
import styles from './typography.module.css';

export const P: FC<ComponentProps<'p'> & TypographyProps> = (props) => (
    <TypographyElement as="p" baseClassName={styles.p} {...props} />
);

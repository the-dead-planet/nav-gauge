import { ComponentProps, FC } from "react";
import { TypographyProps } from "@ui";
import { TypographyElement } from "./TypographyElement";
import styles from './typography.module.css';

export const H5: FC<ComponentProps<'h5'> & TypographyProps> = (props) => (
    <TypographyElement as="h5" baseClassName={styles.h5} {...props} />
);

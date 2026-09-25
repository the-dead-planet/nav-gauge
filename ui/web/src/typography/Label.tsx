import { ComponentProps, FC } from "react";
import { TypographyProps } from "@ui";
import { TypographyElement } from "./TypographyElement";
import styles from './typography.module.css';

export const Label: FC<ComponentProps<'label'> & TypographyProps> = (props) => (
    <TypographyElement as="label" baseClassName={styles.label} {...props} />
);

import { FC } from "react";
import { CompanionNumberInputProps, getCompanionNumberInputWidth } from "@ui";
import { NumberInput } from "./NumberInput";
import styles from "./number-input.module.css";

export const CompanionNumberInput: FC<CompanionNumberInputProps> = ({
    placement,
    ...props
}) => (
    <div
        className={styles.companion}
        style={{ width: getCompanionNumberInputWidth(placement) }}
    >
        <NumberInput {...props} />
    </div>
);

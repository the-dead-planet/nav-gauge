import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { CompanionNumberInputProps, getCompanionNumberInputWidth } from "@ui";
import { NumberInput } from "./NumberInput";

const styles = StyleSheet.create({
    container: {
        flexShrink: 0,
    },
});

export const CompanionNumberInput: FC<CompanionNumberInputProps> = ({ placement, ...props }) => (
    <View style={[styles.container, { width: getCompanionNumberInputWidth(placement) }]}>
        <NumberInput {...props} />
    </View>
);

import { Dispatch, FC, SetStateAction } from "react";
import { Text, View } from "react-native";
import { ApplicationSettingsType } from "@tinker-chest";

interface Props {
    applicationSettings: ApplicationSettingsType;
    onApplicationSettingsChange: Dispatch<SetStateAction<ApplicationSettingsType>>;
}

export const Machine: FC<Props> = ({
    applicationSettings,
    onApplicationSettingsChange,
}) => {
    return (
        <View>
            <Text>
                Machine
            </Text>
        </View>
    );
};

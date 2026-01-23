import { Dispatch, FC, SetStateAction } from "react";
import { View } from "react-native";
import { Text } from '@mobile-ui';
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

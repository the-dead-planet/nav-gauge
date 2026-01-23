import { FC } from "react";
import { View } from "react-native";
import { Text } from '@mobile-ui';
import { useStateWarden, useSubjectState } from "@apparatus";

export const Notices: FC = () => {
    const { signaliumBureau } = useStateWarden();
    const [notices] = useSubjectState(signaliumBureau.notices$);

    return (
        <View>
            <Text>
                Notices
            </Text>
        </View>
    );
};

import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useStateWarden, useSubjectState } from "@apparatus";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#d3c5aa"
  },
});

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

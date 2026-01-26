import { FC } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { MachineWardNoticesProps } from "@apparatus";
import { Notice } from "./Notice";

const styles = StyleSheet.create({
    container: {
        pointerEvents: 'box-none',
        position: 'absolute',
        top: 90,
        left: 0,
        right: 0,
    },
    content: {
        paddingHorizontal: 20,
        rowGap:10
    }
});

export const NoticesList: FC<MachineWardNoticesProps> = ({
    notices,
    onRemove
}) => {
    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={notices.slice(0, 5)}
                keyExtractor={item => item.id}
                renderItem={({ item: notice }) => (
                    <Notice key={notice.id} notice={notice} onRemove={onRemove} />
                )}
                contentContainerStyle={styles.content}
            />
        </View>
    );
};

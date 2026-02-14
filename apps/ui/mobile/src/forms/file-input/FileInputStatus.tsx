import { getCauseProp, useTheme } from "@ui";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Heading, Text } from "../../text";

const styles = StyleSheet.create({
    container: {
    },
    text: {
        fontWeight: 700,
        fontSize: 16
    }
});

export interface FileInputStatusProps {
    isLoading?: boolean;
    error?: Error;
    ok: boolean;
    routeName?: string;
}

export const FileInputStatus: FC<FileInputStatusProps> = ({
    isLoading,
    error,
    ok,
    routeName,
}) => {
    const theme = useTheme();
    const stack = getCauseProp('stack', error);
    const cause = getCauseProp('cause', error);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <View>
                    {cause ? (
                        <Heading style={{ color: theme.colors.error }}>
                            {cause}
                        </Heading>
                    ) : null}
                    <Text style={{ color: theme.colors.error }}>
                        {error.message}
                    </Text>
                </View>
            ) : ok
                ? (
                    <Text style={[styles.text, { color: theme.colors.success }]}>
                        {routeName || "Let's go!"}
                    </Text>
                ) : <Text>No file uploaded yet.</Text>}
        </View>
    );
};

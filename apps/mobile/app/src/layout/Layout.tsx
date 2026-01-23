import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    color: "#ffffff"
  }
});

interface Props {
    children: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
};

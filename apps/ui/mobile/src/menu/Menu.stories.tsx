import { View, StyleSheet } from 'react-native';
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { Text } from "../typography";

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 'auto' ,
    },
});

export const PlacementBottomRight = () => (
    <View>
        <Text>placement="bottom-right" (default)</Text>
        <View style={styles.wrapper}>
            <Menu placement="bottom-right">
                <MenuItem label="Option 1" onPress={() => console.log("Option 1")} />
                <MenuItem label="Option 2" onPress={() => console.log("Option 2")} />
            </Menu>
        </View>
    </View>
);

export const PlacementBottomLeft = () => (
    <View>
        <Text>placement="bottom-left"</Text>
        <View style={styles.wrapper}>
            <Menu placement="bottom-left">
                <MenuItem label="Option A" onPress={() => console.log("Option A")} />
                <MenuItem label="Option B" onPress={() => console.log("Option B")} />
                    <Text>hello</Text>
            </Menu>
        </View>
    </View>
);

export const PlacementTopRight = () => (
    <View>
        <Text>placement="top-right"</Text>
        <View style={styles.wrapper}>
            <Menu placement="top-right">
                <MenuItem label="Option X" onPress={() => console.log("Option X")} />
                <MenuItem label="Option Y" onPress={() => console.log("Option Y")} />
            </Menu>
        </View>
    </View>
);

export const PlacementTopLeft = () => (
    <View>
        <Text>placement="top-left"</Text>
        <View style={styles.wrapper}>
            <Menu placement="top-left">
                <MenuItem label="Option 1" onPress={() => console.log("Option 1")} />
                <MenuItem label="Option 2" onPress={() => console.log("Option 2")} />
            </Menu>
        </View>
    </View>
);

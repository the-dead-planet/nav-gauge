import { View, StyleSheet } from 'react-native';
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { Text } from "../typography";

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 'auto',
    },
});

export const MenuPlacements = () => (
    <View>
        <View>
            <Text>placement="bottom-right" (default)</Text>
            <View style={styles.wrapper}>
                <Menu placement="bottom-right">
                    <MenuItem label="Option 1" onPress={() => console.log("Option 1")} />
                    <MenuItem label="Option 2" onPress={() => console.log("Option 2")} />
                </Menu>
            </View>
        </View>
        
        <View>
            <Text>placement="bottom-left"</Text>
            <View style={styles.wrapper}>
                <Menu placement="bottom-left">
                    <MenuItem label="Option A" onPress={() => console.log("Option A")} />
                    <MenuItem label="Option B" onPress={() => console.log("Option B")} />
                </Menu>
            </View>
        </View>

        <View>
            <Text>placement="top-right"</Text>
            <View style={styles.wrapper}>
                <Menu placement="top-right">
                    <MenuItem label="Option X" onPress={() => console.log("Option X")} />
                    <MenuItem label="Option Y" onPress={() => console.log("Option Y")} />
                </Menu>
            </View>
        </View>

        <View>
            <Text>placement="top-left"</Text>
            <View style={styles.wrapper}>
                <Menu placement="top-left">
                    <MenuItem label="Option 1" onPress={() => console.log("Option 1")} />
                    <MenuItem label="Option 2" onPress={() => console.log("Option 2")} />
                    <MenuItem label="Option 3" onPress={() => console.log("Option 3")} />
                    <MenuItem label="Option 4" onPress={() => console.log("Option 4")} />
                    <MenuItem label="Option 5" onPress={() => console.log("Option 5")} />
                </Menu>
            </View>
        </View>
    </View>
);

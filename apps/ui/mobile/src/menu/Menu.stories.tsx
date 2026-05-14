import { Menu } from "./Menu";
import { MenuOption } from "./MenuOption";

export const ExampleMenu = () => {
    return (
        <Menu>
            <MenuOption label="Option 1" onPress={() => console.log("Option 1 selected")} />
            <MenuOption label="Option 2" onPress={() => console.log("Option 2 selected")} />
            <MenuOption label="Option 3" onPress={() => console.log("Option 3 selected")} />
        </Menu>
    );
};

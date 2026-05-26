import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';

const meta = {
    title: 'Menu',
    component: Menu,
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MenuPlacements: Story = {
    render: () => (
        <div>
            <p>placement="bottom-right" (default)</p>
            <div style={{ margin: '0 auto', width: 'max-content' }}>
                <Menu placement="bottom-right">
                    <MenuItem label="Option 1" onPress={() => console.log("Option 1")} />
                    <MenuItem label="Option 2" onPress={() => console.log("Option 2")} />
                </Menu>
            </div>

            <p>placement="bottom-left"</p>
            <div style={{ margin: '0 auto', width: 'max-content' }}>
                <Menu placement="bottom-left">
                    <MenuItem label="Option A" onPress={() => console.log("Option A")} />
                    <MenuItem label="Option B" onPress={() => console.log("Option B")} />
                </Menu>
            </div>

            <p>placement="top-right"</p>
            <div style={{ margin: '0 auto', width: 'max-content' }}>
                <Menu placement="top-right">
                    <MenuItem label="Option X" onPress={() => console.log("Option X")} />
                    <MenuItem label="Option Y" onPress={() => console.log("Option Y")} />
                </Menu>
            </div>

            <p>placement="top-left"</p>
            <div style={{ margin: '0 auto', width: 'max-content' }}>
                <Menu placement="top-left">
                    <MenuItem label="Option 1" onPress={() => console.log("Option 1")} />
                    <MenuItem label="Option 2" onPress={() => console.log("Option 2")} />
                </Menu>
            </div>
        </div>
    ),
};

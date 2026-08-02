import { FC } from "react";
import { Menu, MenuItem } from '@mobile-ui';
import { RootStackParamList } from "../../../navigation";

interface Props {
    onNavigate: (path: keyof RootStackParamList) => void
}

export const LayoutMenu: FC<Props> = ({
    onNavigate,
}) => {
    const menuItems = [
        __DEV__
            ? <MenuItem key="stories" onPress={() => onNavigate('Stories')}>Stories</MenuItem>
            : null,
    ].filter(Boolean);

    return (
        <>
            {menuItems.length > 0 ? (
                <Menu iconActiveColor="secondary">
                    {menuItems}
                </Menu>
            ) : null}
        </>
    );
};

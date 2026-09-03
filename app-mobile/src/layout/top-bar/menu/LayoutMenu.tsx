import { FC, useState } from "react";
import { Menu, MenuItem } from '@mobile-ui';
import { useMobileMachineWard } from "@mobile-apparatus";
import { T } from "@mobile-apparatus";
import { RootStackParamList } from "../../../navigation";
import { SettingsDialog } from "./SettingsDialog";

interface Props {
    onNavigate: (path: keyof RootStackParamList) => void
}

export const LayoutMenu: FC<Props> = ({
    onNavigate,
}) => {
    const { isDev, individuator } = useMobileMachineWard();
    const [showIndividuatorDialog, setShowIndividuatorDialog] = useState(false);

    const menuItems = [
        isDev
            ? <MenuItem key="stories" onPress={() => onNavigate('Stories')}>Stories</MenuItem>
            : null,
        <MenuItem key="individuator" onPress={() => setShowIndividuatorDialog(true)}>
            <T n={individuator.namespace} t={individuator.translationKey.IndividuatorName} />
        </MenuItem>,
    ].filter(Boolean);

    return (
        <>
            {menuItems.length > 0 ? (
                <Menu iconActiveColor="secondary">
                    {menuItems}
                </Menu>
            ) : null}
            {showIndividuatorDialog ? (
                <SettingsDialog onClose={() => setShowIndividuatorDialog(false)} />
            ) : null}
        </>
    );
};

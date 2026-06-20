import { FC, useState } from "react";
import { Menu, MenuItem } from "@web-ui";
import { useMachineWard } from "@apparatus";
import { T } from "@web-apparatus";
import { SettingsDialog } from "./SettingsDialog";

export const LayoutMenu: FC = () => {
    const { namespace, individuator } = useMachineWard();
    const [showIndividuatorDialog, setShowIndividuatorDialog] = useState(false);

    return (
        <>
            <Menu placement="bottom-right" iconActiveColor="secondary">
                <MenuItem
                    key="individuator"
                    type="button"
                    closeOnPress
                    onClick={() => setShowIndividuatorDialog(true)}
                >
                    <T n={individuator.namespace} t="individuator-name" />
                </MenuItem>
                <MenuItem
                    key="legal"
                    type="link"
                    href="/legal"
                    target="_blank"
                    rel="noreferrer"
                >
                    <T n={namespace} t="legal" />
                </MenuItem>
                <MenuItem
                    key="privacy"
                    type="link"
                    href="/privacy"
                    target="_blank"
                    rel="noreferrer"
                >
                    <T n={namespace} t="privacy" />
                </MenuItem>
            </Menu>
            {showIndividuatorDialog ? (
                <SettingsDialog onClose={() => setShowIndividuatorDialog(false)} />
            ) : null}
        </>
    );
}

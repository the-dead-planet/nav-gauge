import { FC, useState } from "react";
import { Menu, MenuItem } from "@web-ui";
import { useMachineWard, useTranslation } from "@apparatus";
import { T } from "@web-apparatus";
import { SettingsDialog } from "./SettingsDialog";
import styles from './layout-menu.module.css';

export const LayoutMenu: FC = () => {
    const { namespace, translationKey, individuator } = useMachineWard();
    const [showIndividuatorDialog, setShowIndividuatorDialog] = useState(false);
    const tooltip = useTranslation({ n: namespace, t: translationKey.Menu })

    return (
        <>
            <Menu
                aria-label={tooltip}
                tooltip={tooltip}
                tooltipPlacement="bottom"
                placement="bottom-right"
                menuListClassName={styles['menu']}
            >
                <MenuItem
                    key="individuator"
                    isFirst
                    type="button"
                    closeOnPress
                    onClick={() => setShowIndividuatorDialog(true)}
                >
                    <T n={individuator.namespace} t={individuator.translationKey.IndividuatorName} />
                </MenuItem>
                <MenuItem
                    key="legal"
                    type="link"
                    href="/legal"
                    target="_blank"
                    rel="noreferrer"
                >
                    <T n={namespace} t={translationKey.Legal} />
                </MenuItem>
                {/* TODO: Move to legal */}
                <MenuItem
                    key="legal"
                    type="link"
                    href="/storybook/?path=/story/icons"
                    target="_blank"
                    rel="noreferrer"
                >
                    Icon creators
                </MenuItem>
                <MenuItem
                    key="privacy"
                    type="link"
                    href="/privacy"
                    target="_blank"
                    rel="noreferrer"
                >
                    <T n={namespace} t={translationKey.Privacy} />
                </MenuItem>
            </Menu>
            {showIndividuatorDialog ? (
                <SettingsDialog onClose={() => setShowIndividuatorDialog(false)} />
            ) : null}
        </>
    );
}

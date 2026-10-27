import { FC, useState } from 'react';
import { Menu, MenuItem } from '@web-ui';
import { getMachineMenuLinks, useTranslation } from '@apparatus';
import { useWebMachineWard } from '@web-apparatus';
import { T } from '@web-apparatus';
import { SettingsDialog } from './settings/SettingsDialog';
import styles from './layout-menu.module.css';

export const LayoutMenu: FC = () => {
    const { namespace, translationKey, individuator } = useWebMachineWard();
    const [showIndividuatorDialog, setShowIndividuatorDialog] = useState(false);
    const tooltip = useTranslation({ n: namespace, t: translationKey.Menu });
    const links = getMachineMenuLinks(window.location.hostname);

    return (
        <>
            <Menu
                aria-label={tooltip}
                tooltip={tooltip}
                iconActiveColor="secondary"
                size="md"
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
                    <T
                        n={individuator.namespace}
                        t={individuator.translationKey.IndividuatorName}
                    />
                </MenuItem>
                <MenuItem
                    key="component-library"
                    type="link"
                    href={links.componentLibrary}
                    target="_blank"
                    rel="noreferrer"
                >
                    <T n={namespace} t={translationKey.ComponentLibrary} />
                </MenuItem>
                <MenuItem
                    key="icon-creators"
                    type="link"
                    href={links.iconCreators}
                    target="_blank"
                    rel="noreferrer"
                >
                    <T n={namespace} t={translationKey.IconCreators} />
                </MenuItem>
                <MenuItem
                    key="legal"
                    type="link"
                    href={links.legal}
                    target="_blank"
                    rel="noreferrer"
                    disabled
                >
                    <T n={namespace} t={translationKey.Legal} />
                </MenuItem>
                <MenuItem
                    key="privacy"
                    type="link"
                    href={links.privacy}
                    target="_blank"
                    rel="noreferrer"
                    disabled
                >
                    <T n={namespace} t={translationKey.Privacy} />
                </MenuItem>
            </Menu>
            {showIndividuatorDialog ? (
                <SettingsDialog
                    onClose={() => setShowIndividuatorDialog(false)}
                />
            ) : null}
        </>
    );
};

import { FC, useState } from 'react';
import { Linking } from 'react-native';
import { Menu, MenuItem } from '@mobile-ui';
import { getMachineMenuLinks, useTranslation } from '@apparatus';
import { T, useMobileMachineWard } from '@mobile-apparatus';
import { RootStackParamList } from '../../../navigation';
import { SettingsDialog } from './settings/SettingsDialog';

const openLink = (href: string) => {
    void Linking.openURL(href).catch(console.error);
};

interface Props {
    onNavigate: (path: keyof RootStackParamList) => void;
}

export const LayoutMenu: FC<Props> = ({ onNavigate }) => {
    const { isDev, namespace, translationKey, individuator } =
        useMobileMachineWard();
    const [showIndividuatorDialog, setShowIndividuatorDialog] = useState(false);
    const tooltip = useTranslation({ n: namespace, t: translationKey.Menu });
    const links = getMachineMenuLinks();

    return (
        <>
            <Menu
                triggerAccessibilityLabel={tooltip}
                tooltip={tooltip}
                iconActiveColor="secondary"
                size="md"
                tooltipPlacement="bottom"
                placement="bottom-right"
            >
                <MenuItem
                    key="individuator"
                    onPress={() => setShowIndividuatorDialog(true)}
                >
                    <T
                        n={individuator.namespace}
                        t={individuator.translationKey.IndividuatorName}
                    />
                </MenuItem>
                {isDev ? (
                    <MenuItem
                        key="stories"
                        linkType="internal"
                        onPress={() => onNavigate('Stories')}
                    >
                        <T n={namespace} t={translationKey.Stories} />
                    </MenuItem>
                ) : null}
                <MenuItem
                    key="component-library"
                    linkType="external"
                    onPress={() => openLink(links.componentLibrary)}
                >
                    <T n={namespace} t={translationKey.ComponentLibrary} />
                </MenuItem>
                <MenuItem
                    key="icon-creators"
                    linkType="external"
                    onPress={() => openLink(links.iconCreators)}
                >
                    <T n={namespace} t={translationKey.IconCreators} />
                </MenuItem>
                <MenuItem
                    key="legal"
                    linkType="external"
                    disabled
                    onPress={() => openLink(links.legal)}
                >
                    <T n={namespace} t={translationKey.Legal} />
                </MenuItem>
                <MenuItem
                    key="privacy"
                    linkType="external"
                    disabled
                    onPress={() => openLink(links.privacy)}
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

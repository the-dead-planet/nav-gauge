import { FC, useState } from "react";
import classNames from "classnames";
import { MachineWardTopBarProps, useMachineWard } from "@apparatus";
import { FontType, Icons, useTheme } from "@ui";
import { Button, H4, H3, Menu, MenuItem, P, Panel, Span } from "@web-ui";
import styles from './top-bar.module.css';
import { createPortal } from "react-dom";

export const TopBar: FC<MachineWardTopBarProps> = ({ title }) => {
    const theme = useTheme();
    const { individuator } = useMachineWard();
    const [showIndividuatorDialog, setShowIndividuatorDialog] = useState(false);

    // TODO: Icons: light/dark mode, sound, geolocation on/off, recording on/off?, menu
    return (
        <>
            <nav className={styles["top-bar"]}>
                <div className={classNames(styles["section"], styles["left"])}>
                    <img src={Icons.Find} width={20} />
                </div>
                <H4 color="primary" fontType={FontType.NeonHeader}>
                    {title}
                </H4>
                <div className={classNames(styles["section"], styles["right"])}>
                    <Button
                        icon={Icons.NounProject.LightBulbCogWheel}
                        onClick={individuator.toggleMode}
                        variant="inset"
                        size="md"
                        color={theme.mode === 'dark' ? "secondary" : 'neutral'}
                        highlightColor={theme.mode === 'dark' ? "neutral" : 'secondary'}
                    />
                    <Menu placement="bottom-right" iconActiveColor="secondary">
                        <MenuItem key="individuator" type="button" closeOnPress onClick={() => setShowIndividuatorDialog(true)}>
                            <Span>Individuator</Span>
                        </MenuItem>
                        <MenuItem
                            key="legal"
                            type="link"
                            href="/legal"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Span>Legal</Span>
                        </MenuItem>
                        <MenuItem
                            key="link"
                            type="link"
                            href="/privacy"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Span>Privacy</Span>
                        </MenuItem>
                    </Menu>
                </div>
            </nav>

            {showIndividuatorDialog ? createPortal(
                <Panel
                    variant='fill-translucent'
                    padding="md"
                    color="primary"
                    style={{ position: 'absolute', margin: "0 auto", top: '50%', left: '50%', transform: "translate(-50%, -50%)" }}
                >
                    <H3 fontType={FontType.NeonText} color="primary">INDIVIDUATOR</H3>
                    <P color="primary">Foo</P>
                    <P color="primary">Bar</P>
                    <P color="primary">Baz</P>
                    <P color="primary">Foo</P>
                    <P color="primary">Foo</P>
                </Panel>,
                document.body,
            ) : null}
        </>
    );
}

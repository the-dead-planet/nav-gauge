import { FC, useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, Menu, MenuItem, P, Span } from "@web-ui";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";

export const LayoutMenu: FC = () => {
    const { individuator } = useMachineWard();
    const [settings, setSettings] = useSubjectState(individuator.settings$);
    const [pendingSettings, setPendingSettings] = useState(individuator.settings$.value);
    const [showIndividuatorDialog, setShowIndividuatorDialog] = useState(false);

    return (
        <>
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

            {showIndividuatorDialog ? createPortal(
                <Dialog
                    placement="right-drawer"
                    header="Individuator"
                    onClose={() => setShowIndividuatorDialog(false)}
                >
                    <P color="primary">Foo</P>
                    <P color="primary">Bar</P>
                    <P color="primary">Baz</P>
                    <P color="primary">Foo</P>
                    <P color="primary">Foo</P>
                </Dialog>,
                document.body,
            ) : null}
        </>
    );
}

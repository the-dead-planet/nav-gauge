import { FC } from "react";
import { Fieldset, Input, TextArea } from "@web-ui";
import { MapLayout, useStateWarden, useSubjectState } from "@apparatus";
import styles from './controls.module.css';

interface Props { }

export const MapLayoutControls: FC<Props> = () => {
    const { cartomancer } = useStateWarden();
    const [mapLayout, setMapLayout] = useSubjectState(cartomancer.mapLayout$);

    return (
        <Fieldset label="Map layout">
            <div className={styles["section"]}>
                <Input
                    id="map-size"
                    name="map-size"
                    label="Full screen"
                    labelPlacement="after"
                    type='checkbox'
                    checked={mapLayout.size.type === 'full-screen'}
                    onChange={() => { }}
                    onContainerClick={() => setMapLayout((prev): MapLayout => ({
                        ...prev, size: {
                            ...prev.size,
                            type: prev.size.type === 'full-screen'
                                ? 'manual'
                                : 'full-screen'
                        }
                    }))}
                    containerClassName={styles["checkbox"]}
                />
                <div />
                <Input
                    id="map-width"
                    name="map-width"
                    label="Width (px)"
                    type='number'
                    disabled={mapLayout.size.type === 'full-screen'}
                    autoSelect
                    min={0}
                    value={mapLayout.size.width}
                    onChange={(event) => {
                        if (!isNaN(Number(event.target.value))) {
                            setMapLayout((prev): MapLayout => ({
                                ...prev,
                                size: {
                                    ...prev.size,
                                    width: Number(event.target.value)
                                }
                            }))
                        }
                    }}
                />
                <Input
                    id="map-height"
                    name="map-height"
                    label="Height (px)"
                    type='number'
                    disabled={mapLayout.size.type === 'full-screen'}
                    autoSelect
                    min={0}
                    value={mapLayout.size.height}
                    onChange={(event) => {
                        if (!isNaN(Number(event.target.value))) {
                            setMapLayout((prev): MapLayout => ({
                                ...prev,
                                size: {
                                    ...prev.size,
                                    height: Number(event.target.value)
                                }
                            }));
                        }
                    }}
                />
                <Input
                    id="map-border-width"
                    name="map-border-width"
                    label="Border width (px)"
                    type='number'
                    autoSelect
                    min={0}
                    value={mapLayout.borderWidth}
                    onChange={(event) => {
                        if (!isNaN(Number(event.target.value))) {
                            setMapLayout((prev): MapLayout => ({ ...prev, borderWidth: Number(event.target.value) }));
                        }
                    }}
                />
                <Input
                    id="map-inner-border-width"
                    name="map-inner-border-width"
                    label="Inner border width (px)"
                    type='number'
                    autoSelect
                    min={0}
                    value={mapLayout.innerBorderWidth}
                    onChange={(event) => {
                        if (!isNaN(Number(event.target.value))) {
                            setMapLayout((prev): MapLayout => ({ ...prev, innerBorderWidth: Number(event.target.value) }));
                        }
                    }}
                />
                <Input
                    id="map-border-color"
                    name="map-border-color"
                    label="Border color"
                    type='color'
                    value={mapLayout.borderColor}
                    onChange={(event) => {
                        setMapLayout((prev): MapLayout => ({ ...prev, borderColor: event.target.value }));
                    }}
                    className={styles["input-color"]}
                />
                <Input
                    id="map-inner-border-color"
                    name="map-inner-border-color"
                    label="Inner border color"
                    type='color'
                    value={mapLayout.innerBorderColor}
                    onChange={(event) => {
                        setMapLayout((prev): MapLayout => ({ ...prev, innerBorderColor: event.target.value }));
                    }}
                    className={styles["input-color"]}
                />
                <TextArea
                    id="map-border-box-shadow"
                    name="map-border-box-shadow"
                    label="Box shadow"
                    value={mapLayout.boxShadow}
                    onChange={(event) => {
                        setMapLayout((prev): MapLayout => ({ ...prev, boxShadow: event.target.value }));
                    }}
                    autoSelect
                    className={styles["textarea"]}
                />
                <TextArea
                    id="map-border-inner-box-shadow"
                    name="map-border-inner-box-shadow"
                    label="Inner box shadow"
                    value={mapLayout.innerBoxShadow}
                    onChange={(event) => {
                        setMapLayout((prev): MapLayout => ({ ...prev, innerBoxShadow: event.target.value }));
                    }}
                    autoSelect
                    className={styles["textarea"]}
                />
                <Input
                    id="map-border-radius"
                    name="map-border-radius"
                    label="Radius (px, %)"
                    type='text'
                    autoSelect
                    value={mapLayout.borderRadius}
                    onChange={(event) => {
                        setMapLayout((prev): MapLayout => ({ ...prev, borderRadius: event.target.value }));
                    }}
                    className={styles["input-color"]}
                />
            </div>
        </Fieldset>
    );
};

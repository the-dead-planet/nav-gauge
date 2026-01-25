import { FC, useEffect } from "react";
import { Cartomancer, useStateWarden, useSubjectState } from "@apparatus";
import * as styles from './controls.module.css';

export const MapStyleSelection: FC = () => {
    const { cartomancer, attributionVault } = useStateWarden();
    const [selectedStyle, setSelectedStyle] = useSubjectState(cartomancer.selectedStyle$)

    const handleMapStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = event.target.value as keyof typeof Cartomancer.styles;
        if (id in Cartomancer.styles) {
            setSelectedStyle({ id });
        }
    }

    useEffect(() => {
        const style = Cartomancer.styles[selectedStyle.id];
        if (!style?.attribution) {
            return;
        }
        attributionVault.addEntry(selectedStyle.id, style.attribution);

        return () => {
            attributionVault.removeEntry(selectedStyle.id);
        };
    }, [selectedStyle.id]);

    return (
        <div className={styles['map-style-selection']}>
            {/* TODO: Move to reusable component */}
            <div>
                <label htmlFor="map-style-selection" style={{ fontSize: "12px" }}>Map style</label>
                <select name="map-style-selection" id="map-style-selection" value={selectedStyle.id} onChange={handleMapStyleChange}>
                    {[...Object.entries(Cartomancer.styles)].map(([id, option]) => (
                        <option key={id} value={id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

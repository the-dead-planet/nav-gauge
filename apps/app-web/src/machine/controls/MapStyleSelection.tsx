import { FC } from "react";
import { Cartomancer, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import styles from './controls.module.css';

export const MapStyleSelection: FC = () => {
    const { cartomancer } = useMachineWard();
    const [selectedStyle, setSelectedStyle] = useSubjectState(cartomancer.selectedStyle$)

    const handleMapStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = event.target.value as keyof typeof Cartomancer.styles;
        if (id in Cartomancer.styles) {
            setSelectedStyle({ id });
        }
    }

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

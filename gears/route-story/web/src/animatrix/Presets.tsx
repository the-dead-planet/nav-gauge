import { ChangeEvent, FC } from "react";
import { BehaviorSubject } from "rxjs";
import {
    Cartomancer,
    GaugeControlsType,
    glitchmitter,
    MapLayout,
    validateGaugeControls,
    validateMapLayout
} from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import RouteStoryGear, { Animatrix, Preset } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import styles from './controls.module.css';

interface Props {
    animatrix: Animatrix;
    preset$: BehaviorSubject<Preset>;
    isPresetActive$: BehaviorSubject<boolean>;
}

export const Presets: FC<Props> = ({ animatrix, preset$, isPresetActive$ }) => {
    const { cartomancer } = useWebMachineWard();
    const [animationControls] = useSubjectState(animatrix.controls$);
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const [mapLayout] = useSubjectState(cartomancer.mapLayout$);
    const [preset, setPreset] = useSubjectState(preset$);
    const [isPresetActive] = useSubjectState(isPresetActive$);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setPreset(event.target.value as Preset);
    };

    const handleExport = () => {
        const jsonString = JSON.stringify({ mapLayout, gaugeControls, animationControls }, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'Nav gauge preset';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (!file) {
            return;
        }
        file
            .text()
            .then((text) => {
                try {
                    const result = JSON.parse(text);
                    const possibleMapLayout: MapLayout = {
                        ...Cartomancer.defaultMapLayout,
                        ...(result.mapLayout as MapLayout),
                    };
                    validateMapLayout(possibleMapLayout);

                    const possibleGaugeControls: GaugeControlsType = {
                        ...Cartomancer.defaultGaugeControls,
                        ...(result.gaugeControls as GaugeControlsType),
                    };
                    validateGaugeControls({ ...possibleGaugeControls });

                    const nextPreset = RouteStoryGear.detectPreset(possibleMapLayout, possibleGaugeControls);
                    if (nextPreset) {
                        setPreset(nextPreset);
                    }
                } catch (e) {
                    glitchmitter.transmit(e);
                }
            })
            .catch(glitchmitter.transmit);
    };

    return (
        <div className={styles['presets']}>
            {/* TODO: Move to reusable component */}
            <div>
                <label htmlFor="presets" style={{ fontSize: "12px" }}>Preset</label>
                <select name="presets" id="presets" value={isPresetActive ? preset : ""} onChange={handleChange}>
                    <option value="" disabled defaultValue="">Custom</option>
                    {RouteStoryGear.presetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles['export-import']}>
                <button onClick={handleExport}>Export</button>
                <button onClick={() => document.getElementById('import-preset')?.click()}>Import</button>
                <input id="import-preset" type="file" accept='json' onChange={handleImport} className={styles['import-input']} />
            </div>
        </div>
    );
};

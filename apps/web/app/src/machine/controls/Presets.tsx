import { FC } from "react";
import {
    AnimationControlsType,
    Animatrix,
    Cartomancer,
    GaugeControlsType,
    MapLayout,
    Preset,
    ToolsStation,
    useStateWarden,
    useSubjectState
} from "@apparatus";
import { validateGaugeControls, validateMapLayout } from "@tinker-chest";
import * as styles from './controls.module.css';

interface Props { }

export const Presets: FC<Props> = () => {
    const { animatrix, cartomancer, toolsStation } = useStateWarden();
    const [animationControls] = useSubjectState(animatrix.controls$);
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const [mapLayout] = useSubjectState(cartomancer.mapLayout$);
    const [preset, setPreset] = useSubjectState(toolsStation.preset$);
    const [isPresetActive] = useSubjectState(toolsStation.isPresetActive$);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
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

                    const possibleAnimationControls = { ...Animatrix.defaultControls, ...(result.animationControls as AnimationControlsType) };
                    Animatrix.validateAnimationControls(possibleAnimationControls);

                    const nextPreset = ToolsStation.detectPreset(possibleMapLayout, possibleGaugeControls, possibleAnimationControls);
                    if (nextPreset) {
                        setPreset(nextPreset);
                    }
                } catch (e) {
                    console.error(e);
                }
            })
            .catch(console.error);
    };

    return (
        <div className={styles['presets']}>
            {/* TODO: Move to reusable component */}
            <div>
                <label htmlFor="presets" style={{ fontSize: "12px" }}>Preset</label>
                <select name="presets" id="presets" value={isPresetActive ? preset : ""} onChange={handleChange}>
                    <option value="" disabled defaultValue="">Custom</option>
                    {ToolsStation.presetOptions.map((option) => (
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

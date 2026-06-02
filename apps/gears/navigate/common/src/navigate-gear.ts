import { Gear, GearTranslationTable } from "@apparatus";

export abstract class NavigateGear<TMap> extends Gear<TMap> {
    public readonly id = 'navigate';

    public translations: GearTranslationTable = {
        en: {
            name: 'Navigate',
            description: 'Navigate using a custom route'
        },
        jp: {
            name: 'ナビゲート',
            description: 'カスタムルートでナビゲーションします。'
        }
    }

    public engage = () => {
        // To be implemented
    };

    public disengage = () => {
        // To be implemented
    };
}

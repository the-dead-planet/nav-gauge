import { Gear, GearTranslationTable } from "@apparatus";

export abstract class RecordRouteGear<TMap> extends Gear<TMap> {
    public readonly id = 'record-route';

    public translations: GearTranslationTable = {
        en: {
            name: 'Record Route',
            description: 'Record your traces'
        },
        jp: {
            name: 'ルートを記録',
            description: '移動ルートを記録する'
        }
    }

    public engage = () => {
        // To be implemented
    };

    public disengage = () => {
        // To be implemented
    };
}

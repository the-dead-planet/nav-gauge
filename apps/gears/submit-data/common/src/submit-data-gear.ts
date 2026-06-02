import { Gear, GearTranslationTable } from "@apparatus";

export abstract class SubmitDataGear<TMap> extends Gear<TMap> {
    public readonly id = 'submit-data';

    public translations: GearTranslationTable = {
        en: {
            name: 'Submit Data',
            description: 'Submit street art data points'
        },
        jp: {
            name: 'データを提出',
            description: 'ストリートアートのデータポイントを投稿する'
        }
    }

    public engage = () => {
        // To be implemented
    };

    public disengage = () => {
        // To be implemented
    };
}

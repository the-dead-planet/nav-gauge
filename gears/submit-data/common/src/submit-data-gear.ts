import { Gear, GearTranslationTable } from "@apparatus";
import * as Translations from "./translations";

export abstract class SubmitDataGear<TMap> extends Gear<TMap> {
    public readonly id = 'submit-data';
    public translations: GearTranslationTable = Translations;

    public engage = () => {
        // To be implemented
    };

    public disengage = () => {
        // To be implemented
    };
}

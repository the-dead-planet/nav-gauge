import { Gear, GearTranslationTable } from "@apparatus";
import * as Translations from "./translations";
import { Icons } from "@ui";

export abstract class SubmitDataGear<TMap> extends Gear<TMap> {
    public readonly id = 'submit-data';
    public translations: GearTranslationTable = Translations;

    public icon = Icons.NounProject.Crash as unknown as string;
    
    public engage = () => {
        // To be implemented
    };

    public disengage = () => {
        // To be implemented
    };
}

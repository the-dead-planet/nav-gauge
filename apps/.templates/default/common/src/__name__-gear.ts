import { Gear, GearTranslationTable } from "@apparatus";
import * as Translations from "./translations";

export abstract class __PascalName__Gear<TMap> extends Gear<TMap> {
    public readonly id = "__name__";
    public translations: GearTranslationTable = Translations;

    public engage = () => {
        // TODO: implement
    };

    public disengage = () => {
        // TODO: implement
    };
}

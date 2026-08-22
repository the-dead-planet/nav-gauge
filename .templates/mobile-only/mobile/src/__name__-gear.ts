import { Gear, GearTranslationTable } from "@apparatus";
import { MobileMap } from "@mobile-apparatus";
import * as Translations from "./translations";

export class Mobile__PascalName__Gear extends Gear<MobileMap> {
    public readonly id = "__name__";
    public translations: GearTranslationTable = Translations;

    public engage = () => {
        // TODO: implement
    };

    public disengage = () => {
        // TODO: implement
    };
}

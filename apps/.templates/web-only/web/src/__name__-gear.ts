import { Gear, GearTranslationTable } from "@apparatus";
import * as Translations from "./translations";

export class Web__PascalName__Gear extends Gear<maplibregl.Map> {
    public readonly id = "__name__";
    public translations: GearTranslationTable = Translations;

    public engage = () => {
        // TODO: implement
    };

    public disengage = () => {
        // TODO: implement
    };
}

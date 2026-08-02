import { Gear, GearTranslationTable } from "@apparatus";
import * as Translations from "./translations";
import { Icons } from "@ui";

export abstract class NavigateGear<TMap> extends Gear<TMap> {
    public readonly id = 'navigate';
    public translations: GearTranslationTable = Translations;

    public icon = Icons.NounProject.AlienGun as unknown as string;

    public engage = () => {
        // To be implemented
    };

    public disengage = () => {
        // To be implemented
    };
}

import { ChronoLens, Gear, GearTranslationTable } from "@apparatus";
import * as Translations from "./translations";
import { Icons } from "@ui";

export abstract class RecordRouteGear<TMap, TChronoLens extends ChronoLens> extends Gear<TMap, TChronoLens> {
    public readonly id = 'record-route';
    public translations: GearTranslationTable = Translations;

    public icon = Icons.NounProject.BrokenBox as unknown as string;
    
    public engage = () => {
        // To be implemented
    };

    public disengage = () => {
        // To be implemented
    };
}

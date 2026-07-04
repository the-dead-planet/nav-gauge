import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const nl: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['nl'] = {
    "gear-name": 'Routeverhaal',
    "gear-description": 'Maak een videoverhaal van je GPS-sporen en beeldgegevens',
    "fit-bounds": 'Doelwit vastleggen',
    "player": 'Routeplayerconfiguratie',
    "no-name": 'Aanduiding nietig',
    "upload-file": 'Bestand met GPS-tracks uploaden',
    "replace-file": 'Bestand met GPS-tracks vervangen',
    "purge-story": 'Verhaal zuiveren',
    "cancel": 'Annuleren'
};

export default nl;

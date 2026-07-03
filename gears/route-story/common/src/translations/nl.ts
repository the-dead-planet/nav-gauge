import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const nl: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['nl'] = {
    "gear-name": 'Routeverhaal',
    "gear-description": 'Maak een videoverhaal van je GPS-sporen en beeldgegevens',
    "fit-bounds": 'Doelwit vastleggen',
    "player": 'Routeplayerconfiguratie',
    "no-name": 'Aanduiding nietig',
    "file": 'Bestand',
    "purge-story": 'Verhaal zuiveren',
    "cancel": 'Annuleren'
};

export default nl;

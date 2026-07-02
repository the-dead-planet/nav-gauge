import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const it: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['it'] = {
    "gear-name": 'Storia del percorso',
    "gear-description": 'Crea una storia video dai tuoi tracciati GPS e dati immagine',
    "fit-bounds": 'Acquisisci bersaglio',
    "player": 'Configurazione del lettore di percorso',
    "no-name": 'Designazione nulla',
    "file": 'File',
    "purge-story": 'Epura storia'
};

export default it;

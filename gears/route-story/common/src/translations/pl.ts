import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const pl: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['pl'] = {
    "gear-name": 'Historia trasy',
    "gear-description": 'Stwórz historię wideo ze swoich śladów GPS i danych obrazu',
    "fit-bounds": 'Uzyskaj cel',
    "player": 'Konfiguracja odtwarzacza trasy',
    "no-name": 'Oznaczenie unieważnione',
    "upload-file": 'Prześlij plik ze śladami GPS',
    "replace-file": 'Zastąp plik ze śladami GPS',
    "purge-story": 'Wyczyść historię',
    "cancel": 'Anuluj'
};

export default pl;

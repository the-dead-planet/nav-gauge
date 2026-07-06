import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const de: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['de'] = {
    "gear-name": 'Routengeschichte',
    "gear-description": 'Erstellen Sie eine Videogeschichte aus Ihren GPS-Spuren und Bilddaten',
    "fit-bounds": 'Ziel erfassen',
    "player": 'Routen-Player-Konfiguration',
    "no-name": 'Bezeichnung aufgehoben',
    "upload-file": 'GPS-Datei hochladen',
    "replace-file": 'GPS-Datei ersetzen',
    "purge-story": 'Geschichte löschen',
    "cancel": 'Abbrechen',
    "destroy-recording": 'Überwachungsmaterial vernichten',
    "start-recording": 'Überwachung starten',
    "stop-recording": 'Überwachung stoppen',
    "pause-recording": 'Überwachung pausieren',
    "resume-recording": 'Überwachung fortsetzen',
    "layer-configuration": 'Ebenen-Ästhetik',
    "lines": 'Linien',
    "points": 'Punkte'
};

export default de;

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
    "cancel": 'Annuleren',
    "destroy-recording": 'Vernietig surveillantiemateriaal',
    "start-recording": 'Surveillance starten',
    "stop-recording": 'Surveillance stoppen',
    "pause-recording": 'Surveillance pauzeren',
    "resume-recording": 'Surveillance hervatten',
    "layer-configuration": 'Laagesthetiek',
    "lines": 'Lijnen',
    "points": 'Punten',
    "slider": 'Schuif',
    "play": 'Afspelen',
    "pause": 'Pauze',
    "image": 'Afbeelding',
    "show-image-markers": 'Afbeeldingsmarkeringen tonen',
    "hide-image-markers": 'Afbeeldingsmarkeringen verbergen',
};

export default nl;

import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const fr: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['fr'] = {
    "gear-name": "Histoire d'itinéraire",
    "gear-description": "Créer une histoire vidéo à partir de vos traces GPS et données d'image",
    "fit-bounds": 'Acquérir la cible',
    "player": 'Configuration du lecteur d\'itinéraire',
    "no-name": 'Désignation nulle',
    "file": 'Fichier'
};

export default fr;

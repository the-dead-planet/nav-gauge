import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const fr: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['fr'] = {
    "gear-name": "Histoire d'itinéraire",
    "gear-description": "Créer une histoire vidéo à partir de vos traces GPS et données d'image",
    "fit-bounds": 'Acquérir la cible',
    "player": 'Configuration du lecteur d\'itinéraire',
    "no-name": 'Désignation nulle',
    "upload-file": 'Télécharger un fichier avec traces GPS',
    "replace-file": 'Remplacer le fichier avec traces GPS',
    "purge-story": 'Purger l\'histoire',
    "cancel": 'Annuler'
};

export default fr;

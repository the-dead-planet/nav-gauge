import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const es: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['es'] = {
    "gear-name": 'Historia de Ruta',
    "gear-description": 'Crear un video a partir de tus trazas GPS y datos de imagen',
    "fit-bounds": 'Adquirir objetivo',
    "player": 'Configuración del reproductor de ruta',
    "no-name": 'Designación anulada',
    "upload-file": 'Subir archivo con rutas GPS',
    "replace-file": 'Reemplazar archivo con rutas GPS',
    "purge-story": 'Purgar historia',
    "cancel": 'Cancelar'
};

export default es;

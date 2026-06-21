import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const en: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['en'] = {
    "gear-name": 'Route Story',
    "gear-description": 'Create a video story out of your GPS traces and image data',
    "fit-bounds": 'Acquire target'
};

export default en;

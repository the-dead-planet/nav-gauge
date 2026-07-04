import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const en: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['en'] = {
    "gear-name": 'Route Story',
    "gear-description": 'Create a video story out of your GPS traces and image data',
    "fit-bounds": 'Acquire target',
    "player": 'Route player configuration',
    "no-name": 'Designation void',
    "upload-file": 'Upload file with GPS tracks',
    "replace-file": 'Replace file with GPS tracks',
    "purge-story": 'Purge story',
    "cancel": 'Cancel'
};

export default en;

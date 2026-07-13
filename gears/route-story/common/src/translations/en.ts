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
    "cancel": 'Cancel',
    "destroy-recording": 'Destroy surveillance material',
    "start-recording": 'Start surveilling',
    "stop-recording": 'Stop surveilling',
    "pause-recording": 'Pause surveilling',
    "resume-recording": 'Resume surveilling',
    "layer-configuration": 'Layer aesthetics',
    "lines": 'Lines',
    "points": 'Points',
    "slider": 'Slider',
    "play": 'Play',
    "pause": 'Pause',
    "image": 'Image',
    "show-image-markers": 'Show image markers',
    "hide-image-markers": 'Hide image markers',
};

export default en;

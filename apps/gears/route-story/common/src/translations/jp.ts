import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const jp: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['jp'] = {
    "gear-name": 'ルートストーリー',
    "gear-description": 'GPSトレースと画像データから動画ストーリーを作成する',
    "fit-bounds": 'ターゲットを捕捉'
};

export default jp;

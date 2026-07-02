import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const jp: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['jp'] = {
    "gear-name": 'ルートストーリー',
    "gear-description": 'GPSトレースと画像データから動画ストーリーを作成する',
    "fit-bounds": 'ターゲットを捕捉',
    "player": 'ルートプレーヤー設定',
    "no-name": '指定解除',
    "file": 'ファイル',
    "purge-story": 'ストーリーをパージ'
};

export default jp;

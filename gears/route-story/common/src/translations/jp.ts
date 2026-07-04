import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const jp: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['jp'] = {
    "gear-name": 'ルートストーリー',
    "gear-description": 'GPSトレースと画像データから動画ストーリーを作成する',
    "fit-bounds": 'ターゲットを捕捉',
    "player": 'ルートプレーヤー設定',
    "no-name": '指定解除',
    "upload-file": 'GPSトラックを含むファイルをアップロード',
    "replace-file": 'GPSトラックを含むファイルを置き換え',
    "purge-story": 'ストーリーをパージ',
    "cancel": 'キャンセル'
};

export default jp;

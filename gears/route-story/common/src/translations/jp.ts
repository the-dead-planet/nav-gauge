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
    "purge-story-text": 'すべてのストーリーデータをパージしてもよろしいですか？ルートと画像が削除され、元に戻せません。',
    "cancel": 'キャンセル',
    "destroy-recording": '監視資料を破棄',
    "start-recording": '監視を開始',
    "stop-recording": '監視を停止',
    "pause-recording": '監視を一時停止',
    "resume-recording": '監視を再開',
    "layer-configuration": 'レイヤーの美学',
    "lines": '線',
    "points": '点',
    "slider": 'スライダー',
    "play": '再生',
    "pause": '一時停止',
    "image": '画像',
    "show-image-markers": '画像マーカーを表示',
    "hide-image-markers": '画像マーカーを非表示',
};

export default jp;

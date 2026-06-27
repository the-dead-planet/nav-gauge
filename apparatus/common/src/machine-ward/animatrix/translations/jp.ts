import { TranslationTable } from "../../translatron";
import { AnimatrixTranslationKey } from "../model";

const jp: TranslationTable<AnimatrixTranslationKey>['jp'] = {
    "animatrix-controls": 'Animatrixコントロール',
    "follow-current-point": '現在地に追従',
    "auto-rotate": '自動回転',
    "camera-angle": 'カメラアングル',
    "camera-roll": 'カメラロール',
    "bearing-line-length-in-meters": '方位線の長さ（メートル）',
    "max-bearing-diff-per-frame": '1フレームあたりの最大方位差',
    "pitch": 'ピッチ',
    "zoom": 'ズーム',
    "zoom-in-to-images": '画像にズームイン',
    "image-pause-duration": '画像の一時停止時間（ms）',
    "speed-multiplier": '速度倍率',
    "ease-duration": 'イーズ時間',
};

export default jp;

import { TranslationTable } from "../../translatron";
import { IndividuatorTranslationKey } from "../model";

const jp: TranslationTable<IndividuatorTranslationKey>['jp'] = {
    "individuator-name": 'インディヴィデュエーター',
    language: '言語',
    "date-format": '日付形式',
    "time-format": '時間形式',
    "distance-unit": '距離単位',
    metric: 'メートル法 (km)',
    imperial: 'ヤード・ポンド法 (mi)',
    theme: 'テーマ',
    "confirm-before-leave": 'ページを離れる前に確認',
    "debug-mode": 'デバッグモード',
};

export default jp;

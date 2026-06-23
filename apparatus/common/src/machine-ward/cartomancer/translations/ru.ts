import { TranslationTable } from "../../translatron";
import { CartomancerTranslationKey } from "../model";

const ru: TranslationTable<CartomancerTranslationKey>['ru'] = {
    "compass": 'Установить на север',
    "zoom-in": 'Увеличить',
    "round-current-zoom": 'Приблизить к {{zoom}}',
    "zoom-out": 'Уменьшить',
};

export default ru;

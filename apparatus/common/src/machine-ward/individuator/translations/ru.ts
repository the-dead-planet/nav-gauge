import { TranslationTable } from "../../translatron";
import { IndividuatorTranslationKey } from "../model";

const ru: TranslationTable<IndividuatorTranslationKey>['ru'] = {
    "individuator-name": 'Индивидуатор',
    language: 'Язык',
    "date-format": 'Формат даты',
    "time-format": 'Формат времени',
    "distance-unit": 'Единицы расстояния',
    metric: 'Метрические (км)',
    imperial: 'Имперские (мили)',
    theme: 'Тема',
    "confirm-before-leave": 'Подтверждение перед выходом',
    "debug-mode": 'Режим отладки',
};

export default ru;

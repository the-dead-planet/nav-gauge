import { GearTranslationKey, TranslationTable } from "@apparatus";
import { RouteStoryTranslationKey } from "../model";

const ru: TranslationTable<GearTranslationKey | RouteStoryTranslationKey>['ru'] = {
    "gear-name": 'История маршрута',
    "gear-description": 'Создайте видеоисторию из ваших GPS-треков и данных изображений',
    "fit-bounds": 'Захватить цель',
    "player": 'Конфигурация плеера маршрута',
    "no-name": 'Обозначение аннулировано',
    "upload-file": 'Загрузить файл с GPS-треками',
    "replace-file": 'Заменить файл с GPS-треками',
    "purge-story": 'Очистить историю',
    "cancel": 'Отмена'
};

export default ru;

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
    "purge-story-text": 'Вы уверены, что хотите очистить все данные истории? Это удалит маршрут и изображения, и это невозможно отменить.',
    "cancel": 'Отмена',
    "destroy-recording": 'Уничтожить материалы наблюдения',
    "start-recording": 'Начать наблюдение',
    "stop-recording": 'Остановить наблюдение',
    "pause-recording": 'Приостановить наблюдение',
    "resume-recording": 'Возобновить наблюдение',
    "layer-configuration": 'Эстетика слоёв',
    "lines": 'Линии',
    "points": 'Точки',
    "slider": 'Ползунок',
    "play": 'Воспроизвести',
    "pause": 'Пауза',
    "image": 'Изображение',
    "show-image-markers": 'Показать маркеры изображений',
    "hide-image-markers": 'Скрыть маркеры изображений',
};

export default ru;

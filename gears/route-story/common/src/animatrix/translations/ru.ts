import { TranslationTable } from "@apparatus";
import { AnimatrixTranslationKey } from "../model";

const ru: TranslationTable<AnimatrixTranslationKey>['ru'] = {
    "animatrix-controls": 'Управление Animatrix',
    "general": 'Общие',
    "follow-current-point": 'Следовать за текущей точкой',
    "auto-rotate": 'Автоповорот',
    "camera-angle": 'Угол камеры',
    "camera-roll": 'Крен камеры',
    "bearing-line-length-in-meters": 'Длина линии пеленга в метрах',
    "max-bearing-diff-per-frame": 'Макс. изменение пеленга за кадр',
    "pitch": 'Наклон',
    "zoom": 'Зум',
    "image-pause-duration": 'Длительность паузы изображения (мс)',
    "speed-multiplier": 'Множитель скорости',
    "ease-duration": 'Длительность перехода',
};

export default ru;

import { TranslationTable } from "../translatron";
import { MachineTranslationKey } from "../model";

const ru: TranslationTable<MachineTranslationKey>['ru'] = {
    legal: 'Правовая информация',
    privacy: 'Конфиденциальность',
    close: 'Закрыть',
    save: 'Сохранить',
    on: 'Вкл.',
    off: 'Выкл.',
    menu: 'Меню приложения',
    'switch-to-light-mode': 'Переключиться на светлый режим',
    'switch-to-dark-mode': 'Переключиться на темный режим',
    gears: 'Механизмы',
    collapse: 'Свернуть',
    expand: 'Развернуть',
    'panel-menu': 'Panel options',
    'swap-placement': 'Place panel on the {{placement}}',
    'drag-to-resize': 'Перетащите, чтобы изменить размер',
    attributions: 'Атрибуция',
    'under-construction': 'В разработке',
};

export default ru;

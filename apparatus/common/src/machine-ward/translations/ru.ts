import { TranslationTable } from "../translatron";
import { MachineTranslationKey } from "../model";

const ru: TranslationTable<MachineTranslationKey>['ru'] = {
    legal: 'Правовая информация',
    privacy: 'Конфиденциальность',
    close: 'Закрыть',
    save: 'Сохранить',
    menu: 'Меню приложения',
    'toggle-mode': 'Переключить светлый и темный режимы',
    gears: 'Механизмы',
    collapse: 'Свернуть',
    expand: 'Развернуть',
    'panel-menu': 'Panel options',
    'swap-placement': 'Place panel on the {{placement}}',
};

export default ru;

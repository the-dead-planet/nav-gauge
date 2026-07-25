import { TranslationTable } from "../translatron";
import { MachineTranslationKey } from "../model";

const de: TranslationTable<MachineTranslationKey>['de'] = {
    legal: 'Impressum',
    privacy: 'Datenschutz',
    close: 'Schließen',
    save: 'Speichern',
    menu: 'Anwendungsmenü',
    'toggle-mode': 'Helle und dunkle Modi umschalten',
    gears: 'Getriebe',
    collapse: 'Einklappen',
    expand: 'Ausklappen',
    'panel-menu': 'Panel options',
    'swap-placement': 'Place panel on the {{placement}}',
};

export default de;

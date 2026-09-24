import { TranslationTable } from "../translatron";
import { MachineTranslationKey } from "../model";

const fr: TranslationTable<MachineTranslationKey>['fr'] = {
    legal: 'Mentions légales',
    privacy: 'Confidentialité',
    close: 'Fermer',
    save: 'Enregistrer',
    on: 'Activé',
    off: 'Désactivé',
    menu: "Menu de l'application",
    'toggle-mode': 'Basculer les modes clair et sombre',
    gears: 'Engrenages',
    collapse: 'Réduire',
    expand: 'Développer',
    'panel-menu': 'Panel options',
    'swap-placement': 'Place panel on the {{placement}}',
    'drag-to-resize': 'Faites glisser pour redimensionner',
    'under-construction': 'En construction',
};

export default fr;

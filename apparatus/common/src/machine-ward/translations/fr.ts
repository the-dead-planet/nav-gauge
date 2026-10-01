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
    'switch-to-light-mode': 'Passer au mode clair',
    'switch-to-dark-mode': 'Passer au mode sombre',
    gears: 'Engrenages',
    collapse: 'Réduire',
    expand: 'Développer',
    'panel-menu': 'Panel options',
    'swap-placement': 'Place panel on the {{placement}}',
    'drag-to-resize': 'Faites glisser pour redimensionner',
    attributions: 'Attributions',
    'under-construction': 'En construction',
};

export default fr;

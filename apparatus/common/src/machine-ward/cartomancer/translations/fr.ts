import { TranslationTable } from "../../translatron";
import { CartomancerTranslationKey } from "../model";

const fr: TranslationTable<CartomancerTranslationKey>['fr'] = {
    "compass": 'Régler sur le nord',
    "zoom-in": 'Zoom avant',
    "round-current-zoom": 'Zoomer à {{zoom}}',
    "zoom-out": 'Zoom arrière',
};

export default fr;

import { Animatrix } from "../animatrix";
import { AttributionVault } from "../attribution-vault";
import { Cartomancer } from "../cartomancer";
import { ChronoLens } from "../chrono-lens";
import { Individuator } from "../individuator";
import { SignaliumBureau } from "../signalium-bureau";
import { ToolsStation } from "../tools-station";
import { Translatron, TranslationTable } from "../translatron";

export interface GearApparatus<TMap> {
    individuator: Individuator;
    signaliumBureau: SignaliumBureau;
    attributionVault: AttributionVault;
    chronoLens: ChronoLens;
    cartomancer: Cartomancer<TMap>;
    animatrix: Animatrix;
    toolsStation: ToolsStation<TMap>;
    translatron: Translatron;
}

export enum GearTranslationKey {
    GearName = 'gear-name',
    GearDescription = 'gear-description',
};

export type GearTranslationTable = TranslationTable<GearTranslationKey>;

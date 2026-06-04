import { Animatrix } from "../animatrix";
import { AttributionVault } from "../attribution-vault";
import { Cartomancer } from "../cartomancer";
import { ChronoLens } from "../chrono-lens";
import { Individuator } from "../individuator";
import { SignaliumBureau } from "../signalium-bureau";
import { ToolsStation } from "../tools-station";
import { Language, Translatron } from "../translatron";

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

export type GearTranslationTable = {
    [key in Language]?: { [key in 'name' | 'description']: string; } & { [key in string]: string };
}

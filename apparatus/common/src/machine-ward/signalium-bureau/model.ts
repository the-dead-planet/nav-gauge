export type SignaliumNotice = GlitchSignaliumNotice | HazardSignaliumNotice | IntelSignaliumNotice;

export interface BaseSignaliumNotice {
    id: string;
    text: string;
}

export interface GlitchSignaliumNotice extends BaseSignaliumNotice {
    type: 'glitch';
    error: Error;
}

export interface HazardSignaliumNotice extends BaseSignaliumNotice {
    type: 'hazard';
}

export interface IntelSignaliumNotice extends BaseSignaliumNotice {
    type: 'intel';
}

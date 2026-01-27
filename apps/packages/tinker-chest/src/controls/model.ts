import { Theme } from "@ui";

export enum CameraAngle {
    Top = 'Top',
    Left = 'Left',
    Front = 'Front',
    Right = 'Right',
    Rear = 'Rear'
}

export interface ApplicationSettingsType {
    theme: Theme;
    /**
     * When set to `true`, a native confirmation popup will be shown before closing or reloading the page.
     */
    confirmBeforeLeave: boolean;
}

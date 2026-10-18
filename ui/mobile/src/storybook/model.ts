import { ComponentType, ReactNode } from 'react';
import { StoryControls } from '@ui';

export type MobileStoryArgs = Record<string, unknown>;

export interface MobileStoryDefinition<Props extends object = MobileStoryArgs> {
    args: Props;
    controls: StoryControls<Props>;
    galleryEditableControls?: readonly Extract<keyof Props, string>[];
    renderPlayground: (args: Props) => ReactNode;
    renderGallery: (args: Props) => ReactNode;
}

export interface StoryEntry {
    id: string;
    group: string;
    name: string;
    definition?: MobileStoryDefinition;
    legacyStories: { name: string; Component: ComponentType }[];
}

export interface StoryGroup {
    name: string;
    description: string;
    entries: StoryEntry[];
}

import { ComponentProps } from 'react';
import { tabstripStoryArgs, tabstripStoryControls } from '@ui';
import { Tabstrip } from './Tabstrip';
import { TabstripPreview } from './TabstripPreview';
import { MobileStoryDefinition } from '../../storybook/model';

const story: MobileStoryDefinition<ComponentProps<typeof Tabstrip>> = {
    args: { ...tabstripStoryArgs, onChange: () => undefined },
    controls: tabstripStoryControls,
    galleryEditableControls: [
        'children',
        'highlightColor',
        'glyphsShade',
        'highlightGlyphsShade',
        'highlighted',
        'disabled',
        'spread',
    ],
    renderPlayground: (args) => <TabstripPreview args={args} />,
    renderGallery: (args) => <TabstripPreview args={args} gallery />,
};
export default story;

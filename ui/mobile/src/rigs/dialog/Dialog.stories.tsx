import { ComponentProps } from 'react';
import { dialogStoryArgs, dialogStoryControls } from '@ui';
import { Dialog } from './Dialog';
import { DialogPreview } from './DialogPreview';
import { MobileStoryDefinition } from '../../storybook/model';

const story: MobileStoryDefinition<ComponentProps<typeof Dialog>> = {
    args: { ...dialogStoryArgs, onClose: () => undefined },
    controls: dialogStoryControls,
    galleryEditableControls: ['header', 'closeText', 'children'],
    renderPlayground: (args) => <DialogPreview args={args} />,
    renderGallery: (args) => <DialogPreview args={args} gallery />,
};
export default story;

import { ComponentProps } from 'react';
import { popupStoryArgs, popupStoryControls } from '@ui';
import { Popup } from './Popup';
import { PopupPreview } from './PopupPreview';
import { MobileStoryDefinition } from '../../storybook/model';

const story: MobileStoryDefinition<ComponentProps<typeof Popup>> = {
    args: {
        ...popupStoryArgs,
        visible: false,
        onClose: () => undefined,
        modal: true,
        position: { x: 100, y: 200 },
    },
    controls: {
        ...popupStoryControls,
        modal: { control: 'boolean' },
    },
    galleryEditableControls: [
        'children',
        'modal',
        'triggerAnchor',
        'popupAnchor',
        'dismissOnClickAway',
    ],
    renderPlayground: (args) => <PopupPreview args={args} />,
    renderGallery: (args) => <PopupPreview args={args} gallery />,
};
export default story;

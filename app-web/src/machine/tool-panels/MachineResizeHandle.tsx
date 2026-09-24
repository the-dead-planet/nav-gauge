import { FC } from 'react';
import { ResizeHandleProps } from '@ui';
import { useTranslation } from '@apparatus';
import { useWebMachineWard } from '@web-apparatus';
import { ResizeHandle } from '@web-ui';

type Props = Omit<ResizeHandleProps, 'tooltip'>;

export const MachineResizeHandle: FC<Props> = (props) => {
    const { namespace, translationKey } = useWebMachineWard();
    const tooltip = useTranslation({ n: namespace, t: translationKey.DragToResize });

    return <ResizeHandle {...props} tooltip={tooltip} />;
};

import { FC } from 'react';
import { ResizeHandleProps } from '@ui';
import { useTranslation } from '@apparatus';
import { useMobileMachineWard } from '@mobile-apparatus';
import { ResizeHandle } from '@mobile-ui';

type Props = Omit<ResizeHandleProps, 'tooltip'>;

export const MachineResizeHandle: FC<Props> = (props) => {
    const { namespace, translationKey } = useMobileMachineWard();
    const tooltip = useTranslation({ n: namespace, t: translationKey.DragToResize });

    return <ResizeHandle {...props} tooltip={tooltip} />;
};

import { CSSProperties, FC } from "react";
import classNames from 'classnames';
import { SignaliumNotice } from "@apparatus";
import * as styles from './notices.module.css';

interface Props {
    index: number;
    notice: SignaliumNotice;
    onRemove: (id: string) => void;
}
export const Notice: FC<Props> = ({
    index,
    notice,
    onRemove
}) => {
    return (
        <dialog
            open
            className={classNames(styles['notice'], styles[notice.type])}
            style={{ '--index': index } as CSSProperties}
        >
            <p>{notice.text} {notice.type === 'error' ? notice.error.message || '' : ''}</p>
            <form method="dialog" className={styles['footer']}>
                <button onClick={() => onRemove(notice.id)}>
                    Close
                </button>
            </form>
        </dialog>
    );
};

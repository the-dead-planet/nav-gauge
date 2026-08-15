import { FC } from "react";
import styles from './pages.module.css';

interface Props {
    stage?: string;
}

export const LoadingPage: FC<Props> = ({ stage }) => {
    return (
        <div className={styles['page']}>
            <p className={styles['text']}>
                {['Loading', stage].filter(Boolean).join(' ')}...
            </p>
        </div>
    );
};

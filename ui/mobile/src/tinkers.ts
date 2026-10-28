import { BehaviorSubject } from 'rxjs';
import { TopBarBackAction } from './model';

export const topBarBackAction$ = new BehaviorSubject<TopBarBackAction | null>(
    null,
);

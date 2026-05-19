import { FC } from 'react';
import { IconProps } from './model';
import { Icon } from './Icon';

import beaker from './svg/beaker.svg';
import find from './svg/find.svg';

export const BeakerIcon: FC<IconProps> = (props) => <Icon src={beaker} {...props} />;
export const FindIcon: FC<IconProps> = (props) => <Icon src={find} {...props} />;

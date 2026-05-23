import { FC } from 'react';
import { IconProps } from './model';
import { Icon } from './Icon';
import { Icons } from '@ui'

export const AlienGunIcon: FC<IconProps> = (props) => <Icon src={Icons.NounProject.AlienGun} {...props} />;
export const BeakerIcon: FC<IconProps> = (props) => <Icon src={Icons.Beaker} {...props} />;
export const CyberIcon: FC<IconProps> = (props) => <Icon src={Icons.NounProject.Cyber} {...props} />;
export const FindIcon: FC<IconProps> = (props) => <Icon src={Icons.Find} {...props} />;

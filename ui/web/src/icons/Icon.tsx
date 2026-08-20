import { FC, useCallback } from "react";
import { ReactSVG } from 'react-svg';
import classNames from "classnames";
import { IconProps } from "./model";
import { Icons } from "@ui";
import styles from './icon.module.css';

interface Props {
    src: string;
    /**
     * Defaults to "true"
     */
    ariaHidden?: boolean;
}

export const Icon: FC<Props & IconProps> = ({ src, width = 24, height = 24, strokeWidth, ariaHidden = true, className, fallback: userFallback, ...props }) => {
    const color = props.color;
    const fill = props.fill || color;
    const stroke = props.stroke || color;

    const beforeInjection = (svg: SVGSVGElement) => {
        svg.setAttribute('style', `
            width:${width}px;
            height:${height}px;
            fill:${fill || 'currentColor'};
            stroke:${stroke || 'currentColor'};
            color:${color || 'inherit'};
            stroke-width:${strokeWidth || 'inherit'}px
        `);
    };

    const fallback = () => (
        <Icon
            color={color}
            fill={fill}
            stroke={stroke}
            width={width}
            height={height}
            strokeWidth={strokeWidth}
            ariaHidden={ariaHidden}
            src={Icons.NounProject.Crash}
            fallback={() => <span>Err!</span>}
        />
    );

    return (
        <ReactSVG
            key={[width, height, fill, stroke, color, strokeWidth].join('')}
            src={src}
            fallback={userFallback || fallback}
            wrapper="span"
            aria-hidden={ariaHidden}
            beforeInjection={beforeInjection}
            className={classNames(styles['icon'], className)}
            {...props}
        />
    );
};

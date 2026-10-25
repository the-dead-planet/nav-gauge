import { FC } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    TooltipProps,
} from "@ui";
import { Panel } from "../../hud/panel";
import { useTooltip } from "./useTooltip";
import styles from "./tooltip.module.css";

export const TooltipContent: FC<TooltipProps> = (props) => {
    const {
        content,
        color = DEFAULT_COLOR,
        variant = DEFAULT_FILL_VARIANT,
        size = DEFAULT_SIZE,
        maxWidth = 220,
    } = props;
    const {
        trigger,
        visible,
        tooltipRef,
        tooltipId,
        position,
        effectivePlacement,
        connectionLine,
    } = useTooltip(props);
    return (
        <>
            {trigger}
            {visible &&
            content !== null &&
            content !== undefined &&
            content !== false &&
            content !== ""
                ? createPortal(
                      <>
                          <Panel
                              forwardRef={tooltipRef}
                              id={tooltipId}
                              role="tooltip"
                              elevationLayer="tooltip"
                              color={color}
                              variant={variant}
                              className={classNames(
                                  styles["tooltip-content"],
                                  styles[`placement-${effectivePlacement}`],
                                  styles[`size-${size}`],
                              )}
                              style={{
                                  top: position.top,
                                  left: position.left,
                                  width: "max-content",
                                  maxWidth,
                              }}
                          >
                              {content}
                          </Panel>
                          {connectionLine ? (
                              <div
                                  data-appearance-variant={variant}
                                  data-appearance-color={color}
                                  data-appearance-highlight={color}
                                  className={styles["connection-line"]}
                                  style={connectionLine}
                              />
                          ) : null}
                      </>,
                      document.body,
                  )
                : null}
        </>
    );
};

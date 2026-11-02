import { ReactNode, useEffect, useRef, useState } from 'react';
import { getVisibleTabIndexes, SizeVariant, TabstripOption } from '@ui';

export const useTabstripLayout = ({
    options,
    value,
    size,
    children,
}: {
    options: readonly TabstripOption[];
    value: string;
    size: SizeVariant;
    children: ReactNode;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const measurementRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const previousContentRef = useRef({ children, value });
    const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
    const [contentHeight, setContentHeight] = useState<number>();
    const [outgoingContent, setOutgoingContent] = useState<{
        children: ReactNode;
        value: string;
    }>();

    useEffect(() => {
        const previousContent = previousContentRef.current;
        if (previousContent.value === value) {
            return;
        }
        setOutgoingContent(previousContent);
        const timeout = window.setTimeout(
            () => setOutgoingContent(undefined),
            200,
        );
        return () => window.clearTimeout(timeout);
    }, [value]);

    useEffect(() => {
        previousContentRef.current = { children, value };
    });

    useEffect(() => {
        const container = containerRef.current;
        const measurement = measurementRef.current;
        if (!container || !measurement) {
            return;
        }
        const updateVisibleCount = () => {
            const widths = Array.from(
                measurement.children,
                (child) => child.getBoundingClientRect().width,
            );
            const overflowWidth = widths.pop() ?? 0;
            setVisibleIndexes(
                getVisibleTabIndexes(
                    widths,
                    container.getBoundingClientRect().width,
                    overflowWidth,
                    options.findIndex((option) => option.value === value),
                ),
            );
        };
        let animationFrame = 0;
        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(updateVisibleCount);
        });
        observer.observe(container);
        observer.observe(measurement);
        updateVisibleCount();
        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrame);
        };
    }, [options, size, value]);

    useEffect(() => {
        const content = contentRef.current;
        if (!content) {
            return;
        }
        const updateHeight = () =>
            setContentHeight(content.getBoundingClientRect().height);
        let animationFrame = 0;
        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(updateHeight);
        });
        observer.observe(content);
        updateHeight();
        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrame);
        };
    }, [children, value]);

    return {
        containerRef,
        measurementRef,
        contentRef,
        visibleIndexes,
        contentHeight,
        outgoingContent,
    };
};

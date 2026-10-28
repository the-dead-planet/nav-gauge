import { useState } from 'react';
import { LayoutAnimation, LayoutChangeEvent } from 'react-native';
import { getVisibleTabIndexes, TabstripOption } from '@ui';

export const useTabstripLayout = (
    options: readonly TabstripOption[],
    value: string,
    onChange: (value: string) => void,
) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [optionWidths, setOptionWidths] = useState<number[]>([]);
    const [overflowWidth, setOverflowWidth] = useState(0);
    const visibleIndexes =
        optionWidths.length === options.length
            ? getVisibleTabIndexes(
                  optionWidths,
                  containerWidth,
                  overflowWidth,
                  options.findIndex((option) => option.value === value),
              )
            : [];
    const setOptionWidth = (index: number, event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width;
        setOptionWidths((current) =>
            current[index] === width
                ? current
                : Object.assign([...current], { [index]: width }),
        );
    };
    const selectTab = (selectedValue: string) => {
        LayoutAnimation.configureNext({
            duration: 200,
            update: { type: LayoutAnimation.Types.easeInEaseOut },
        });
        onChange(selectedValue);
    };
    return {
        setContainerWidth,
        optionWidths,
        overflowWidth,
        setOverflowWidth,
        visibleIndexes,
        setOptionWidth,
        selectTab,
    };
};

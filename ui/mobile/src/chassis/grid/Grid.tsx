import { FC } from "react";
import {
    ScrollView,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { GridProps } from "@ui";
import { FlexBox } from "../flex-box/FlexBox";
import { useGridColumns } from "./useGridColumns";

const styles = StyleSheet.create({
    equalCell: {
        flex: 1,
        minWidth: 0,
    },
    intrinsicCell: {
        flexGrow: 0,
        flexShrink: 0,
    },
});

export const Grid: FC<GridProps & { style?: StyleProp<ViewStyle> }> = ({
    cols = "equal-1",
    justifyContent,
    alignItems,
    gap,
    rowGap,
    colGap,
    style,
    children,
}) => {
    const { rows, columnWidths, measureCell, equalColumns } = useGridColumns(
        children,
        cols,
    );
    const layoutStyle = StyleSheet.flatten(style);

    return (
        <FlexBox direction="column" gap={rowGap ?? gap} style={style}>
            {rows.map((row) => (
                <FlexBox
                    key={row.key}
                    gap={colGap ?? gap}
                    justifyContent={justifyContent}
                    alignItems={alignItems}
                    style={{
                        columnGap: layoutStyle?.columnGap ?? layoutStyle?.gap,
                    }}
                >
                    {row.cells.map((cell, column) => (
                        <View
                            key={cell.key}
                            style={
                                equalColumns
                                    ? styles.equalCell
                                    : { width: columnWidths[column] }
                            }
                        >
                            {equalColumns ? (
                                cell.child
                            ) : (
                                <ScrollView
                                    horizontal
                                    scrollEnabled={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.intrinsicCell}
                                    onContentSizeChange={(width) =>
                                        measureCell(cell.key, width)
                                    }
                                >
                                    {cell.child}
                                </ScrollView>
                            )}
                        </View>
                    ))}
                </FlexBox>
            ))}
        </FlexBox>
    );
};

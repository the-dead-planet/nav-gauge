import { useEffect, useState } from "react";
import { ColorFormat, formatColor, parseColor, tryParseColor } from "../colors";

interface ColorInputState {
    draft: string;
    format: ColorFormat;
    invalid: boolean;
    changeDraft: (value: string) => void;
    changeFormat: (format: ColorFormat) => void;
    changeColor: (value: string) => void;
}

export const useColorInputState = (
    value: string,
    onChange: (value: string) => void,
): ColorInputState => {
    const parsedValue = tryParseColor(value);
    const [format, setFormat] = useState<ColorFormat>(parsedValue?.format ?? "hex");
    const [draft, setDraft] = useState(value);
    const [invalid, setInvalid] = useState(false);

    useEffect(() => {
        const nextParsedValue = tryParseColor(value);
        setDraft(value);
        setInvalid(false);
        if (nextParsedValue) {
            setFormat(nextParsedValue.format);
        }
    }, [value]);

    const changeDraft = (nextDraft: string) => {
        const nextParsedValue = tryParseColor(nextDraft);
        setDraft(nextDraft);
        setInvalid(!nextParsedValue);
        if (nextParsedValue) {
            setFormat(nextParsedValue.format);
            onChange(nextDraft);
        }
    };

    const changeFormat = (nextFormat: ColorFormat) => {
        const nextValue = formatColor(
            tryParseColor(draft)?.color ?? parseColor(value),
            nextFormat,
        );
        setFormat(nextFormat);
        setDraft(nextValue);
        setInvalid(false);
        onChange(nextValue);
    };

    const changeColor = (nextValue: string) => {
        const nextColor = parseColor(nextValue);
        const nextFormat = nextColor.a < 1
            ? format === "hsl" || format === "hsla"
                ? "hsla"
                : "rgba"
            : format;
        const formattedValue = formatColor(nextColor, nextFormat);
        setDraft(formattedValue);
        setFormat(nextFormat);
        setInvalid(false);
        onChange(formattedValue);
    };

    return { draft, format, invalid, changeDraft, changeFormat, changeColor };
};
